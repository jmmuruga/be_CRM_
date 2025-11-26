import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { BankAccountCreation } from "../Bank Acc Creation/bankAccCreation.model";
import { BankMaster } from "../Bank Master/bankMaster.model";
import { UpiTypeDTO } from "../UPI Type/upiType.dto";
import { UpiType } from "../UPI Type/upiType.model";
import {
  PaymentTypeDTO,
  paymentTypeStatus,
  paymentTypeValidation,
} from "./paymentType.dto";
import { PaymentType } from "./paymentType.model";
import { Request, Response } from "express";

export const getPaymentTypeId = async (req: Request, res: Response) => {
  try {
    const paymentTypeRepository = appSource.getRepository(PaymentType);
    let paymentTypeId = await paymentTypeRepository.query(
      `SELECT paymentTypeId
            FROM [${process.env.DB_NAME}].[dbo].[payment_type]
            Group by paymentTypeId
            ORDER BY CAST(paymentTypeId AS INT) DESC;`
    );

    let id = "0";
    if (paymentTypeId?.length > 0) {
      id = paymentTypeId[0].paymentTypeId;
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

export const getDetailsForLinkedAccNum = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = req.params.companyId;
    const repo = appSource.getRepository(BankAccountCreation);
    const results = await repo
      .createQueryBuilder("bac")
      .innerJoin(BankMaster, "bm", "bm.bankNameId = bac.Bank")
      .select([
        "bac.id AS accountId",
        "bac.bankAccountNumber AS accountNumber",
        "bac.Branch AS branchLocation",
        "bm.bankNameId AS bankId",
        "bm.bankShortName AS bankShortName",
        "bm.bankFullName AS bankFullName",
      ])
      .where(`bac.companyId = ${companyId}`)
      .getRawMany();

    return res.status(200).send({
      Result: results,
    });
  } catch (error) {
    return res.status(500).send({
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const addUpdatePaymentType = async (req: Request, res: Response) => {
  const payload: PaymentTypeDTO = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  try {
    const validation = paymentTypeValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const paymentTypeRepository = appSource.getRepository(PaymentType);
    const existingDetails = await paymentTypeRepository.findOneBy({
      paymentTypeId: payload.paymentTypeId,
    });

    if (existingDetails) {
      let updatedFields = await getChangedProperty(
        [payload],
        [existingDetails]
      );

      await paymentTypeRepository
        .update({ paymentTypeId: payload.paymentTypeId }, payload)
        .then(async () => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Payment Type Details For "${payload.paymentTypeName}" Updated Successfully - Changes : ${updatedFields}`,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Payment Type Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Payment Type Details "${payload.paymentTypeName}" - ${error.message} By User - `,
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
      await paymentTypeRepository.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Payment Type Details For "${payload.paymentTypeName}" Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Payment Type Details Added successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Payment Type Details For "${payload.paymentTypeName}" - ${error.message} By User - `,
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

export const getPaymentTypeDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const paymentTypeRepository = appSource.getRepository(PaymentType);

    const paymentTypeDetails = await paymentTypeRepository.query(
      `SELECT * FROM [${process.env.DB_NAME}].[dbo].[payment_type]`
    );

    const upiTypeRepository = appSource.getRepository(UpiType);
    const upiTypeNames = await upiTypeRepository.findBy({
      companyId: companyId,
    });

    paymentTypeDetails.forEach((x) => {
      x.upiTypeName = upiTypeNames.find(
        (upi) => upi.upiTypeId === x.paymentTypeName
      )?.upiTypeName;
    });
    res.status(200).send({
      Result: paymentTypeDetails,
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

export const updatePaymentTypestatus = async (req: Request, res: Response) => {
  const paymentTypeStatus: paymentTypeStatus = req.body;
  const paymentTypeRepository = appSource.getRepository(PaymentType);
  const paymentTypeFound = await paymentTypeRepository.findOneBy({
    paymentTypeId: paymentTypeStatus.paymentTypeId,
    companyId: paymentTypeStatus.companyId,
  });
  try {
    if (!paymentTypeFound) {
      throw new ValidationException("Company Not Found");
    }
    await paymentTypeRepository
      .createQueryBuilder()
      .update(PaymentType)
      .set({ status: paymentTypeStatus.status })
      .where({ paymentTypeId: paymentTypeStatus.paymentTypeId })
      .andWhere({ companyId: paymentTypeStatus.companyId })
      .execute();

    const logsPayload: logsDto = {
      userId: paymentTypeStatus.userId,
      userName: null,
      statusCode: "200",
      message: ` Status For - ${paymentTypeFound.paymentTypeName} Changed To ${paymentTypeStatus.status} By User - `,
      companyId: paymentTypeStatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Changed Successfully For - ${paymentTypeFound.paymentTypeName} `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: paymentTypeStatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Payment Type Status For - ${paymentTypeFound.paymentTypeName} to ${paymentTypeStatus.status} - ${error.message} By User - `,
      companyId: paymentTypeStatus.companyId,
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

export const deletePaymentType = async (req: Request, res: Response) => {
  const { companyId, userId, paymentTypeId } = req.params;
  const paymentTypeRepository = appSource.getTreeRepository(PaymentType);
  const paymentTypeFound = await paymentTypeRepository.findOneBy({
    paymentTypeId: paymentTypeId,
    companyId: companyId,
  });
  try {
    if (!paymentTypeFound) {
      throw new ValidationException("Payment Type Not Found ");
    }
    await paymentTypeRepository
      .createQueryBuilder()
      .delete()
      .from(PaymentType)
      .where({ paymentTypeId: paymentTypeId })
      .andWhere({ companyId: companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Payment Type : "${paymentTypeFound.paymentTypeName}" Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Payment Type "${paymentTypeFound.paymentTypeName}" Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Payment Type : "${paymentTypeFound.paymentTypeName}" - ${error.message} By User - `,
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
