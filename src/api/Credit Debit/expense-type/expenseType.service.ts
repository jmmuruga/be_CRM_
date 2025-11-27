import { Not } from "typeorm";
import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { ExpenseType } from "./expenseType.model";
import { Request, Response } from "express";
import { expenseTypeDTO, expenseTypeStatus, expenseTypeValidation } from "./expenseType.dto";


export const getExpenseTypeId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const expenseTypeRepositry = appSource.getRepository(ExpenseType);
    let expenseTypeId = await expenseTypeRepositry.query(
      `SELECT expenseTypeId
            FROM [${process.env.DB_NAME}].[dbo].[expense_type] where companyId = ${companyid}
            Group by expenseTypeId
            ORDER BY CAST(expenseTypeId AS INT) DESC;`
    );

    let id = "0";
    if (expenseTypeId?.length > 0) {
      id = expenseTypeId[0].expenseTypeId;
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

export const addUpdateExpenseType = async (req: Request, res: Response) => {
  const payload : expenseTypeDTO = req.body;
  const userId = payload.isEdited ? payload.editedBy_userId : payload.createdBy_userId;
  const companyId = payload.companyId;

  try{
    const validation = expenseTypeValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const expenseTypeRepositry = appSource.getRepository(ExpenseType);
    const existingDetails = await expenseTypeRepositry.findOneBy({
      expenseTypeId: payload.expenseTypeId,
      companyId: payload.companyId,
    });
    // delete payload.companyId;

    if (existingDetails) {
      const nameValidation = await expenseTypeRepositry.findOneBy({
        expenseTypeName: payload.expenseTypeName,
        expenseTypeId: Not(payload.expenseTypeId),
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Expense Type Name Already Exist");
      }

      await expenseTypeRepositry.update({expenseTypeId : payload.expenseTypeId ,companyId: payload.companyId}, payload)
      .then (async () => {
        let updatedFields: string = await getChangedProperty(
          [payload],[existingDetails]
        );
        const logsPayload : logsDto = {
          userId: userId,
          userName: null,
          statusCode: "200",
          message: `Expense Type Details For "${payload.expenseTypeName}" Updated - Changes : ${updatedFields}By User - `,
          companyId: companyId,
        };
        await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Expense Type Details Updated Successfully",
          });
      }).catch(async (error) => {
        const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Expense Type Details ${payload.expenseTypeName} - ${error.message} By User - `,
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
      const nameValidation = await expenseTypeRepositry.findOneBy({
        expenseTypeName: payload.expenseTypeName,
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Expense Type Name Already Exist");
      }

      await expenseTypeRepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Expense Type Details ${payload.expenseTypeName} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Expense Type Details Added Successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Expense Type Details ${payload.expenseTypeName} - ${error.message} By User - `,
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

export const getExpenseTypeDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const expenseTypeRepositry = appSource.getRepository(ExpenseType);
    const expenseTypeResult = await expenseTypeRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();
    res.status(200).send({
      Result: expenseTypeResult,
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

export const updateExpenseTypeStatus = async (req : Request , res: Response) => {
  const expenseTypeStatus : expenseTypeStatus = req.body;
  const expenseTypeRepositry =  appSource.getRepository(ExpenseType);
  const expenseTypeFound = await expenseTypeRepositry.findOneBy({
    expenseTypeId: expenseTypeStatus.expenseTypeId,
    companyId: expenseTypeStatus.companyId,
  });
  try{
    if(!expenseTypeFound){
      throw new ValidationException("Expense Type Not Found");
    }

    await expenseTypeRepositry.createQueryBuilder()
    .update(ExpenseType)
    .set({ status: expenseTypeStatus.status })
    .where({ expenseTypeId: expenseTypeStatus.expenseTypeId })
    .andWhere({ companyId: expenseTypeStatus.companyId })
    .execute();
    const logsPayload: logsDto = {
      userId: expenseTypeStatus.userId,
      userName: null,
      statusCode: "200",
      message: `Expense Type Status For ${expenseTypeFound.expenseTypeName} Changed To ' ${expenseTypeStatus.status} ' By User - `,
      companyId: expenseTypeStatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status For ${expenseTypeFound.expenseTypeName} Changed Successfully`,
    });


  }
  catch (error) {
    const logsPayload: logsDto = {
      userId: expenseTypeStatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Expense Type Status For ${expenseTypeFound.expenseTypeName} To ${expenseTypeStatus.status} - ${error.message} By User - `,
      companyId: expenseTypeStatus.companyId,
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

export const deleteExpenseType = async (req: Request, res: Response) => {
  const {expenseTypeId,companyId ,userId} = req.params;
  const expenseTypeRepositry = appSource.getRepository(ExpenseType);
  const expenseTypeFound = await expenseTypeRepositry.findOneBy({
    expenseTypeId: expenseTypeId,
    companyId: companyId,
  });

  try{
    if (!expenseTypeFound){
      throw new ValidationException("Expense Type Not Found");
    }
    await expenseTypeRepositry.createQueryBuilder()
    .delete()
    .from(ExpenseType)
    .where({ expenseTypeId: expenseTypeId })
    .andWhere({ companyId: companyId })
    .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Expense Type Details : ${expenseTypeFound.expenseTypeName} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${expenseTypeFound.expenseTypeName} Deleted Successfully `,
    });

  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Expense Type Details : ${expenseTypeFound.expenseTypeName} - ${error.message} By User - `,
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




