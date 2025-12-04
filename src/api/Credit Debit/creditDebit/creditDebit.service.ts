import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { CreditDebit } from "./creditDebit.model";
import { ValidationException } from "../../../core/exception";
import { CreditDebitDTO, creditDebitValidation } from "./creditDebit.dto";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { employeeRegistration } from "../../Employee/employeeRegistration/employeeRegistration.model";
import { CreditDebitType } from "../creditDebitType/creditDebitType.model";

export const getCreditDebitId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const creditDebitRepo = appSource.getRepository(CreditDebit);
    let receiptId = await creditDebitRepo.query(
      `SELECT receiptId
            FROM [${process.env.DB_NAME}].[dbo].[credit_debit] where companyId = '${companyid}'
            Group by receiptId
            ORDER BY CAST(receiptId AS INT) DESC;`
    );

    let id = "0";
    if (receiptId?.length > 0) {
      id = receiptId[0].receiptId;
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

export const addUpdateCreditDebit = async (req: Request, res: Response) => {
  const payload: CreditDebitDTO = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  try {
    const validation = creditDebitValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const creditDebitRepositry = appSource.getRepository(CreditDebit);

    const existingDetails = await creditDebitRepositry.findOneBy({
      receiptId: payload.receiptId,
      companyId: payload.companyId,
    });
    // delete payload.companyId;

    if (existingDetails) {
      await creditDebitRepositry
        .update(
          { receiptId: payload.receiptId, companyId: payload.companyId },
          payload
        )
        .then(async () => {
          let updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Credit Debit Details For Receipt "${payload.receiptId}" Updated - Changes : ${updatedFields}By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Credit Debit Details Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Credit Debit Details For Receipt "${payload.receiptId}" - ${error.message} By User - `,
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
      await creditDebitRepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Credit Debit Details For Receipt "${payload.receiptId}" Added By User - `,
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
      message: `Error While Adding Credit Debit Details For Receipt "${payload.receiptId}" - ${error.message} By User - `,
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

export const getCreditDebitDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;

    const creditDebitRepositry = appSource.getRepository(CreditDebit);
    const credDebitResult = await creditDebitRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();

    const employeeRegRepositry = appSource.getRepository(employeeRegistration);
    const employee = await employeeRegRepositry.createQueryBuilder().getMany();

    const creditDebitTypeRepositry = appSource.getRepository(CreditDebitType);
    const credDebitTypeResult = await creditDebitTypeRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();

    credDebitResult.forEach((x) => {
      if (+x.accountType === 1) {
        const type = credDebitTypeResult.find(
          (y) => +y.creditDebitId === +x.typeId
        );
        x["creditDebitType"] = type ? type.creditDebitName : "";
      }
      if (+x.accountType === 2) {
        const emp = employee.find((y) => +y.employeeId === +x.typeId);
        x["employee"] = emp ? emp.employeeName : "";
      }
    });

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

export const deleteCreditDebit = async (req: Request, res: Response) => {
  const {receiptId,companyId ,userId} = req.params;
  const creditDebitRepositry = appSource.getRepository(CreditDebit);
  const creditDebitFound = await creditDebitRepositry.findOneBy({
    receiptId: receiptId,
    companyId: companyId,
  });

  try{
    if (!creditDebitFound){
      throw new ValidationException("Credit Debit Not Found");
    }
    await creditDebitRepositry.createQueryBuilder()
    .delete()
    .from(CreditDebit)
    .where({ receiptId: receiptId })
    .andWhere({ companyId: companyId })
    .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Credit Debit Details For Receipt "${creditDebitFound.receiptId}" Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Credit Debit Details" Deleted Successfully `,
    });

  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Credit Debit Details For Receipt "${creditDebitFound.receiptId}" - ${error.message} By User - `,
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