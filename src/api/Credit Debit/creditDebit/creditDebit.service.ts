import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { CreditDebit } from "./creditDebit.model";
import { ValidationException } from "../../../core/exception";


export const getCreditDebitId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const creditDebitRepo = appSource.getRepository(CreditDebit);
    let receiptId = await creditDebitRepo.query(
      `SELECT receiptId
            FROM [${process.env.DB_NAME}].[dbo].[credit_debit] where companyId = ${companyid}

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