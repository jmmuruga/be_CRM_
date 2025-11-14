import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { CreditDebit } from "./credit-debit.model";

export const getCreditDebitId = async (req: Request, res: Response) => {
  try {
    const creditDebitRepositry = appSource.getRepository(CreditDebit);
    let creditDebitId = await creditDebitRepositry.query(
      `SELECT creditDebitId
            FROM [${process.env.DB_NAME}].[dbo].[credit_debit]
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
