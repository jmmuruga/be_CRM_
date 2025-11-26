import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { PaymentType } from "../Payment Type/paymentType.model";
import { UpiTypeDTO, upiTypeStatus, upiTypeValidation } from "./upiType.dto";
import { UpiType } from "./upiType.model";
import { Request, Response } from "express";

export const getUpiTypeId = async (req: Request, res: Response) => {
  try {
    const upiTypeRepository = appSource.getRepository(UpiType);
    let upiTypeId = await upiTypeRepository.query(
      `SELECT upiTypeId
            FROM [${process.env.DB_NAME}].[dbo].[upi_type]
            Group by upiTypeId
            ORDER BY CAST(upiTypeId AS INT) DESC;`
    );

    let id = "0";
    if (upiTypeId?.length > 0) {
      id = upiTypeId[0].upiTypeId;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const addUpdateUpiType = async (req: Request, res: Response) => {
  const payload: UpiTypeDTO = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  try {
    const validation = upiTypeValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const upiTypeRepository = appSource.getRepository(UpiType);
    const existingDetails = await upiTypeRepository.findOneBy({
      upiTypeId: payload.upiTypeId,
    });

    if (existingDetails) {
      let updatedFields = await getChangedProperty(
        [payload],
        [existingDetails]
      );

      await upiTypeRepository
        .update({ upiTypeId: payload.upiTypeId }, payload)
        .then(async () => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `UPI Type Details For "${payload.upiTypeName}" Updated Successfully - Changes : ${updatedFields}`,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "UPI Type Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating UPI Type Details "${payload.upiTypeName}" - ${error.message} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          if (error instanceof ValidationException) {
            return res.status(400).send({
              message: error?.message,
            });
          }
          res.status(500).send(error);
        });
      return;
    } else {
      await upiTypeRepository.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `UPI Type Details For "${payload.upiTypeName}" Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "UPI Type Details Added successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding UPI Type Details For "${payload.upiTypeName}" - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getUpiType = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const upiTypeRepository = appSource.getRepository(UpiType);
    const upiType = await upiTypeRepository
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();
    res.status(200).send({
      Result: upiType,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const updateUpiTypeStatus = async (req: Request, res: Response) => {
  const upiTypeStatus: upiTypeStatus = req.body;
  const upiTypeRepository = appSource.getRepository(UpiType);
  const upiTypeFound = await upiTypeRepository.findOneBy({
    upiTypeId: upiTypeStatus.upiTypeId,
    companyId: upiTypeStatus.companyId,
  });
  try {
    if (!upiTypeFound) {
      throw new ValidationException("UPI Type Not Found");
    }
    await upiTypeRepository
      .createQueryBuilder()
      .update(UpiType)
      .set({ status: upiTypeStatus.status })
      .where({ upiTypeId: upiTypeStatus.upiTypeId })
      .andWhere({ companyId: upiTypeStatus.companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: upiTypeStatus.userId,
      userName: null,
      statusCode: "200",
      message: ` Status For ${upiTypeFound.upiTypeName} Changed To ${upiTypeStatus.status} By User - `,
      companyId: upiTypeStatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Changed Successfully For ${upiTypeFound.upiTypeName} `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: upiTypeStatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing UPI Type Status For ${upiTypeFound.upiTypeName} to ${upiTypeStatus.status} - ${error.message} By User - `,
      companyId: upiTypeStatus.companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const deleteUpiType = async (req: Request, res: Response) => {
  const { upiTypeId, companyId, userId } = req.params;
  const upiTypeRepository = appSource.getRepository(UpiType);
  const upiTypeFound = await upiTypeRepository.findOneBy({
    upiTypeId: upiTypeId,
    companyId: companyId,
  });
  try {
    if (!upiTypeFound) {
      throw new ValidationException("UPI Type Not Found ");
    }

    const paymentTypeRepositry = appSource.getRepository(PaymentType);
    const paymentTypeDetailsExist = await paymentTypeRepositry.findBy({
      linkedAccountNumber: upiTypeId,
    });
    if (paymentTypeDetailsExist?.length > 0) {
      throw new ValidationException(
        "Unable To Delete , UPI Type Exist In Payment Type !"
      );
    }
    await upiTypeRepository
      .createQueryBuilder()
      .delete()
      .from(UpiType)
      .where({ upiTypeId: upiTypeId })
      .andWhere({ companyId: companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: ` UPI Type Details : ${upiTypeFound.upiTypeName} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `UPI Type ${upiTypeFound.upiTypeName} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting UPI Type : ${upiTypeFound.upiTypeName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send(error);
  }
};
