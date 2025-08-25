import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { serviceProviderMaster } from "./serviceProviderMaster.model";
import { ValidationException } from "../../core/exception";


export const getServiceProviderId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const serviceProviderRepositry =
      appSource.getRepository(serviceProviderMaster);
    let serviceProviderId = await serviceProviderRepositry.query(
      `SELECT serviceProviderId
            FROM [${process.env.DB_NAME}].[dbo].[service_provider_master] where companyId = ${companyid}
            Group by serviceProviderId
            ORDER BY CAST(serviceProviderId AS INT) DESC;`
    );

    let id = "0";
    if (serviceProviderId?.length > 0) {
      id = serviceProviderId[0].serviceProviderId;
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