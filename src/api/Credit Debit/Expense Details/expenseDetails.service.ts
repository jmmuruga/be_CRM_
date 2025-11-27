import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { ExpenseDetails } from "./expenseDetails.model";
import { ValidationException } from "../../../core/exception";
import {
  expenseDetailsDTO,
  expenseDetailsValidation,
} from "./expenseDetails.dto";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { ExpenseType } from "../expense-type/expenseType.model";

export const getDebitId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const expenseDetailsRepositry = appSource.getRepository(ExpenseDetails);
    let debitId = await expenseDetailsRepositry.query(
      `SELECT debitId
            FROM [${process.env.DB_NAME}].[dbo].[expense_details] where companyId = ${companyid}

            Group by debitId
            ORDER BY CAST(debitId AS INT) DESC;`
    );

    let id = "0";
    if (debitId?.length > 0) {
      id = debitId[0].debitId;
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

export const addUpdateExpenseDetails = async (req: Request, res: Response) => {
  const payload: expenseDetailsDTO = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;
  try {
    const validation = expenseDetailsValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const expenseDetailsRepositry = appSource.getRepository(ExpenseDetails);
    const existingDetails = await expenseDetailsRepositry.findOneBy({
      debitId: payload.debitId,
      companyId: payload.companyId,
    });
    if (existingDetails) {
      await expenseDetailsRepositry
        .update(
          { debitId: payload.debitId, companyId: payload.companyId },
          payload
        )
        .then(async (r) => {
          let updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Expense Details For "${payload.debitId}" Updated - Changes : ${updatedFields} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Expense Details Updated successFully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Expense Details ${payload.debitId} - ${error.message} By User - `,
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
      const nameValidation = await expenseDetailsRepositry.findOneBy({
        debitId: payload.debitId,
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Domain Name Already Exist ");
      }
      await expenseDetailsRepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Expense Details ${payload.debitId} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Expense Details Added successFully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Expense Details ${payload.debitId} - ${error.message} By User - `,
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

export const getExpenseDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;

    const expenseDetailsRepositry = appSource.getRepository(ExpenseDetails);
    const expenseDetails = await expenseDetailsRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();

    const expenseTypeRepositry = appSource.getRepository(ExpenseType);
    const expenseTypeDetails = await expenseTypeRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    expenseDetails.forEach((x) => {
      x["expType"] = expenseTypeDetails.find(
        (y) => +y.expenseTypeId == +x.expenseType
      )?.expenseTypeName;
    });

    res.status(200).send({
      Result: expenseDetails,
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

export const deleteExpenseTypeDetails = async (req: Request, res: Response) => {
  const { debitId, companyId, userId } = req.params;
  const expenseDetailsRepositry = appSource.getTreeRepository(ExpenseDetails);
  const expenseDetailsFound = await expenseDetailsRepositry.findOneBy({
    debitId: debitId,
    companyId: companyId,
  });
  try {
    if (!expenseDetailsFound) {
      throw new ValidationException("Expense Details Not Found ");
    }

    await expenseDetailsRepositry
      .createQueryBuilder()
      .delete()
      .from(ExpenseDetails)
      .where({ debitId: debitId })
      .andWhere({ companyId: companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Expense Details For : ${expenseDetailsFound.debitId} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Expense Details For ${expenseDetailsFound.debitId} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Expense Details : ${expenseDetailsFound.debitId} - ${error.message} By User - `,
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
