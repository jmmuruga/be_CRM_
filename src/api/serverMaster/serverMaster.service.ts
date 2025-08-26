import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { serverMaster } from "./serverMaster.model";
import { ValidationException } from "../../core/exception";


export const getServerMasterId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const serverMasterRepositry = appSource.getRepository(
      serverMaster
    );
    let serverPlanId = await serverMasterRepositry.query(
      `SELECT serverPlanId
            FROM [${process.env.DB_NAME}].[dbo].[server_master] where companyId = ${companyid}
            Group by serverPlanId
            ORDER BY CAST(serverPlanId AS INT) DESC;`
    );

    let id = "0";
    if (serverPlanId?.length > 0) {
      id = serverPlanId[0].serverPlanId;
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