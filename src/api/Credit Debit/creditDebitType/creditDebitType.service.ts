import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { Not } from "typeorm";
import { CreditDebitType } from "./creditDebitType.model";
import { CreditDebitTypeDTO, creditDebitTypeStatus, creditDebitTypeValidation } from "./creditDebitType.dto";

export const getCreditDebitTypeId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const creditDebitRepositry = appSource.getRepository(CreditDebitType);
    let creditDebitId = await creditDebitRepositry.query(
      `SELECT creditDebitId
            FROM [${process.env.DB_NAME}].[dbo].[credit_debit_type] where companyId = ${companyid}
            Group by creditDebitId
            ORDER BY CAST(creditDebitId AS INT) DESC;`
    );

    let id = "0";
    if (creditDebitId?.length > 0) {
      id = creditDebitId[0].creditDebitId;
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

export const addUpdateCreditDebitType = async (req: Request, res: Response) => {
  const payload : CreditDebitTypeDTO = req.body;
  const userId = payload.isEdited ? payload.editedBy_userId : payload.createdBy_userId;
  const companyId = payload.companyId;

  try{
    const validation = creditDebitTypeValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const creditDebitRepositry = appSource.getRepository(CreditDebitType);

    const existingDetails = await creditDebitRepositry.findOneBy({
      creditDebitId: payload.creditDebitId,
      companyId: payload.companyId,
    });
    // delete payload.companyId;

    if (existingDetails) {
      const nameValidation = await creditDebitRepositry.findOneBy({
        creditDebitName: payload.creditDebitName,
        creditDebitId: Not(payload.creditDebitId),
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Credit Debit Name Already Exist");
      }

      const mobileValidation = await creditDebitRepositry.findOneBy({
        Mobile: payload.Mobile,
        creditDebitId: Not(payload.creditDebitId),
        companyId: payload.companyId,
      });
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist");
      }

      await creditDebitRepositry.update({creditDebitId : payload.creditDebitId , companyId: payload.companyId }, payload)
      .then (async () => {
        let updatedFields: string = await getChangedProperty(
          [payload],[existingDetails]
        );
        const logsPayload : logsDto = {
          userId: userId,
          userName: null,
          statusCode: "200",
          message: `Customer Details For "${payload.creditDebitName}" Updated - Changes : ${updatedFields}By User - `,
          companyId: companyId,
        };
        await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Credit Debit Details Updated Successfully",
          });
      }).catch(async (error) => {
        const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Credit Debit Details ${payload.creditDebitName} - ${error.message} By User - `,
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
      return
    } else {
      const nameValidation = await creditDebitRepositry.findOneBy({
        creditDebitName: payload.creditDebitName,
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Credit Debit Name Already Exist");
      }
      const mobileValidation = await creditDebitRepositry.findOneBy({
        Mobile: payload.Mobile,
        companyId: payload.companyId,
      });
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist");
      }

      await creditDebitRepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Credit Debit Details ${payload.creditDebitName} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Credit Debit Details Added Successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Credit Debit Details ${payload.creditDebitName} - ${error.message} By User - `,
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

export const getCreditDebitTypeDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const creditDebitRepositry = appSource.getRepository(CreditDebitType);
    const credDebitResult = await creditDebitRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();
    res.status(200).send({
      Result: credDebitResult,
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

export const updateCreditDebitTypeStatus = async (req : Request , res: Response) => {
  const creditdebitStatus : creditDebitTypeStatus = req.body;
  const creditDebitRepositry =  appSource.getRepository(CreditDebitType);
  const creditDebitFound = await creditDebitRepositry.findOneBy({
    creditDebitId: creditdebitStatus.creditDebitId,
    companyId: creditdebitStatus.companyId,
  });
  try{
    if(!creditDebitFound){
      throw new ValidationException("Credit Debit Not Found");
    }

    await creditDebitRepositry.createQueryBuilder()
    .update(CreditDebitType)
    .set({ status: creditdebitStatus.status })
    .where({ creditDebitId: creditdebitStatus.creditDebitId })
    .andWhere({ companyId: creditdebitStatus.companyId })
    .execute();
    const logsPayload: logsDto = {
      userId: creditdebitStatus.userId,
      userName: null,
      statusCode: "200",
      message: `Credit Debit Status For ${creditDebitFound.creditDebitName} Changed To ' ${creditdebitStatus.status} ' By User - `,
      companyId: creditdebitStatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status For ${creditDebitFound.creditDebitName} Changed Successfully`,
    });
  }
  catch (error) {
    const logsPayload: logsDto = {
      userId: creditdebitStatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Credit Debit Status For ${creditDebitFound.creditDebitName} To ${creditdebitStatus.status} - ${error.message} By User - `,
      companyId: creditdebitStatus.companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
}

export const deleteCreditDebitType = async (req: Request, res: Response) => {
  const {creditDebitId,companyId ,userId} = req.params;
  const creditDebitRepositry = appSource.getRepository(CreditDebitType);
  const creditDebitFound = await creditDebitRepositry.findOneBy({
    creditDebitId: creditDebitId,
    companyId: companyId,
  });

  try{
    if (!creditDebitFound){
      throw new ValidationException("Credit Debit Not Found");
    }
    await creditDebitRepositry.createQueryBuilder()
    .delete()
    .from(CreditDebitType)
    .where({ creditDebitId: creditDebitId })
    .andWhere({ companyId: companyId })
    .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Credit Debit Details : ${creditDebitFound.creditDebitName} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${creditDebitFound.creditDebitName} Deleted Successfully `,
    });

  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Credit Debit Details : ${creditDebitFound.creditDebitName} - ${error.message} By User - `,
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

}

