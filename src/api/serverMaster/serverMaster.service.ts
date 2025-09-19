import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { serverMaster } from "./serverMaster.model";
import { ValidationException } from "../../core/exception";
import {
  serverMasterDto,
  serverMasterStatus,
  serverMasterValidation,
} from "./serverMaster.dto";
import { serviceProviderMaster } from "../serviceProviderMaster/serviceProviderMaster.model";
import { Not } from "typeorm";
import { domainRegistration } from "../domainRegistration/domainRegistration.model";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const getServerMasterId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const serverMasterRepositry = appSource.getRepository(serverMaster);
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

export const addUpdateServerMaster = async (req: Request, res: Response) => {
  const payload: serverMasterDto = req.body;
  const userId = payload.isEdited? payload.editedBy_userId : payload.createdBy_userId;
  const companyId = payload.companyId;
  try {
    const validation = serverMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const existingDetails = await serverMasterRepositry.findOneBy({
      serverPlanId: payload.serverPlanId,
      companyId: payload.companyId,
    });

    if (existingDetails) {
      const nameValidation = await serverMasterRepositry.findOneBy({
        serverPlan: payload.serverPlan,
        serverPlanId: Not(payload.serverPlanId),
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Server Name Already Exist ");
      }

      const userNameValidation = await serverMasterRepositry.findOneBy({
        userName: payload.userName,
        serverPlanId: Not(payload.serverPlanId),
      });
      if (userNameValidation) {
        throw new ValidationException("User Name Already Exist ");
      }

      const emailValidation = await serverMasterRepositry.findOneBy({
        emailAddress: payload.emailAddress,
        serverPlanId: Not(payload.serverPlanId),
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist ");
      }
      await serverMasterRepositry
        .update(
          {
            serverPlanId: payload.serverPlanId,
            companyId: payload.companyId,
          },
          payload
        )
        .then(async (r) => {
          const logsPayload: logsDto = {
                      userId: userId,
                      userName: null,
                      statusCode: "200",
                      message: `Server Master Details ${payload.serverPlan} Updated By User - `,
                      companyId: companyId,
                    };
                    await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Server Master Details Updated successFully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Updating Server Master Details ${payload.serverPlan} - ${error.message} By User - `,
                companyId: companyId
              }
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

      const userNameValidation = await serverMasterRepositry.findOneBy({
        userName: payload.userName,
        serverPlanId: payload.serverPlanId,
      });
      if (userNameValidation) {
        throw new ValidationException("User Name Already Exist ");
      }
      const emailValidation = await serverMasterRepositry.findOneBy({
        emailAddress: payload.emailAddress,
        serverPlanId: payload.serverPlanId,
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist ");
      }
      const nameValidation = await serverMasterRepositry.findOneBy({
        serverPlan: payload.serverPlan,
        serverPlanId: payload.serverPlanId,
      });
      if (nameValidation) {
        throw new ValidationException("Server Name Already Exist ");
      }
      await serverMasterRepositry.save(payload);
      const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '200',
                message: `Server Master Details ${payload.serverPlan} Added By User - `,
                companyId: companyId
              }
              await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Server Master Details Added successFully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Adding Server Master Details ${payload.serverPlan} - ${error.message} By User - `,
                companyId: companyId
              }
              await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getServerMasterDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;

    const serviceProviderMasterRepositry = appSource.getRepository(serviceProviderMaster);
    const serviceProviderDetails = await serviceProviderMasterRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const servermaster = await serverMasterRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    const domainRegistrationRepositry = appSource.getRepository(domainRegistration);
    const domainRegistrationDetails = await domainRegistrationRepositry
    .createQueryBuilder()
    .where({companyId:companyId})
    .getMany()

    servermaster.forEach((x) => {
      x["domainName"] = domainRegistrationDetails.find((y)=> +y.domainNameId == +x.domainName).domainName;
    });

    //  console.log(serviceProviderDetails , 'serv')
    //  console.log(servermaster , 'server master')
    servermaster.forEach((x) => {
      x["serviceProviderName"] =
        serviceProviderDetails.find(
          (y) => +y.serviceProviderId == +x.serviceProvider
        ).serviceProviderName;
    });

    res.status(200).send({
      Result: servermaster,
    });
  } catch (error) {
    // console.log(error)
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const updateStatus = async (req: Request, res: Response) => {
   const serverMasterStatus: serverMasterStatus = req.body;
    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const serverMasterFound = await serverMasterRepositry.findOneBy({
      serverPlanId: serverMasterStatus.serverPlanId,
      companyId: serverMasterStatus.companyId,
    });
  try {
   
    if (!serverMasterFound) {
      throw new ValidationException("Server Plan Not Found ");
    }

    await serverMasterRepositry
      .createQueryBuilder()
      .update(serverMaster)
      .set({ status: serverMasterStatus.status })
      .where({ serverPlanId: serverMasterStatus.serverPlanId })
      .andWhere({ companyId: serverMasterStatus.companyId })
      .execute();
      const logsPayload: logsDto = {
                userId: serverMasterStatus.userId,
                userName: null,
                statusCode: '200',
                message: `Service Provider Status For ${serverMasterFound.serverPlan} Changed To ${serverMasterStatus.status} By User - `,
                companyId: serverMasterStatus.companyId
              }
              await InsertLog(logsPayload);


    res.status(200).send({
      IsSuccess: `Status for ${serverMasterFound.serverPlan} Changed Successfully`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
                userId: serverMasterStatus.userId,
                userName: null,
                statusCode: '400',
                message: `Error While Changing Service Provider Status For ${serverMasterFound.serverPlan} to ${serverMasterStatus.status} - ${error.message} By User - `,
                companyId: serverMasterStatus.companyId
              }
              await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const deleteServerMaster = async (req: Request, res: Response) => {
  const serverPlanId = req.params.serverPlanId;
     const {companyId,userId} = req.params;

    const serverMasterRepositry = appSource.getTreeRepository(serverMaster);
    const serverMasterFound = await serverMasterRepositry.findOneBy({
      serverPlanId: serverPlanId,
      companyId: companyId,
    });
  try {
    
    if (!serverMasterFound) {
      throw new ValidationException("Server Plan Not Found");
    }

    await serverMasterRepositry
      .createQueryBuilder()
      .delete()
      .from(serverMaster)
      .where({ serverPlanId: serverPlanId })
      .andWhere({ companyId: companyId })
      .execute();
      const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '200',
                message: `Server Master Details : ${serverMasterFound.serverPlan} Deleted By User - `,
                companyId:companyId
              }
              await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: `${serverMasterFound.serverPlan} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Deleting Server Master Details : ${serverMasterFound.serverPlan} - ${error.message} By User - `,
                companyId:companyId
              }
              await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send(error);
  }
};
