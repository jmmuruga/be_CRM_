import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { serviceProviderMaster } from "./serviceProviderMaster.model";
import { ValidationException } from "../../core/exception";
import {
  serviceProviderMasterDto,
  serviceProviderMasterStatus,
  serviceProviderMasterValidation,
} from "./serviceProviderMaster.dto";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { Not } from "typeorm";
import { getChangedProperty } from "../../shared/helper";
import { serverMaster } from "../serverMaster/serverMaster.model";
import { domainMaster } from "../domainMaster/domainMaster.model";

export const getServiceProviderId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const serviceProviderRepositry = appSource.getRepository(
      serviceProviderMaster
    );
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

export const addUpdateServiceProvider = async (req: Request, res: Response) => {
  const payload: serviceProviderMasterDto = req.body;
  const userId = payload.isEdited? payload.editedBy_userId : payload.createdBy_userId;
  const companyId = payload.companyId;
  try {
    
    const validation = serviceProviderMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const serviceProviderRepositry = appSource.getRepository(
      serviceProviderMaster
    );
    const existingDetails = await serviceProviderRepositry.findOneBy({
      serviceProviderId: payload.serviceProviderId,
      companyId: payload.companyId,
    });

    if (existingDetails) {
      const nameValidation = await serviceProviderRepositry.findOneBy({
        serviceProviderName: payload.serviceProviderName,
        companyId: payload.companyId,
        serviceProviderId:Not(payload.serviceProviderId)
      });
      if (nameValidation) {
        throw new ValidationException("Service Provider Already Exist ");
      }
      await serviceProviderRepositry
        .update(
          {
            serviceProviderId: payload.serviceProviderId,
            companyId: payload.companyId,
          },
          payload
        )
        .then(async (r) => {
          let updatedFields : string = await getChangedProperty([payload] , [existingDetails] )
           const logsPayload: logsDto = {
                      userId: userId,
                      userName: null,
                      statusCode: "200",
                      message: `Service Provider Details For "${payload.serviceProviderName}" Updated - Changes : ${updatedFields} By User - `,
                      companyId: companyId,
                    };
                    await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Service Provider Details Updated successFully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Updating Service Provider Details ${payload.serviceProviderName} - ${error.message} By User - `,
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
      const nameValidation = await serviceProviderRepositry.findOneBy({
        serviceProviderName: payload.serviceProviderName,
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Service Provider Already Exist ");
      }
      await serviceProviderRepositry.save(payload);
       const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '200',
                message: ` "Service Provider Details ${payload.serviceProviderName} Added By User - `,
                companyId: companyId
              }
              await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Details Added successFully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Adding Service Provider Registration Details ${payload.serviceProviderName} - ${error.message} By User - `,
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

export const getServiceProviderDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = req.params.companyId;
    const serviceProviderRepositry = appSource.getRepository(
      serviceProviderMaster
    );
    const servicePro = await serviceProviderRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();
    res.status(200).send({
      Result: servicePro,
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

export const updateStatus = async (req: Request, res: Response) => {
  const serviceProviderStatus: serviceProviderMasterStatus = req.body;
  const serviceProviderRepositry = appSource.getRepository(serviceProviderMaster);
    const serviceProviderFound = await serviceProviderRepositry.findOneBy({
      serviceProviderId: serviceProviderStatus.serviceProviderId,
      companyId: serviceProviderStatus.companyId,
    });
  try {
    
    
    if (!serviceProviderFound) {
      throw new ValidationException(" Server Provider Not Found");
    }

    await serviceProviderRepositry
      .createQueryBuilder()
      .update(serviceProviderMaster)
      .set({ status: serviceProviderStatus.status })
      .where({ serviceProviderId: serviceProviderStatus.serviceProviderId })
      .andWhere({ companyId: serviceProviderStatus.companyId })
      .execute();
      const logsPayload: logsDto = {
                userId: serviceProviderStatus.userId,
                userName: null,
                statusCode: '200',
                message: `Service Provider Status For ${serviceProviderFound.serviceProviderName} Changed To ${serviceProviderStatus.status} By User - `,
                companyId: serviceProviderStatus.companyId
              }
              await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for ${serviceProviderFound.serviceProviderName} Changed Successfully`,
    });
  } catch (error) {
     const logsPayload: logsDto = {
                userId: serviceProviderStatus.userId,
                userName: null,
                statusCode: '400',
                message: `Error While Changing Service Provider Status For ${serviceProviderFound.serviceProviderName} to ${serviceProviderStatus.status} - ${error.message} By User - `,
                companyId: serviceProviderStatus.companyId
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

export const deleteServiceProviderDetails = async (req: Request,res: Response) => {
   const serviceProviderId = req.params.serviceProviderId;
   const {companyId,userId} = req.params;
   const serviceProviderRepositry = appSource.getTreeRepository(
    serviceProviderMaster);
    const serviceProviderFound = await serviceProviderRepositry.findOneBy({
      serviceProviderId: serviceProviderId,
      companyId: companyId,
    });
  try {
    if (!serviceProviderFound) {
      throw new ValidationException("Service Provider Not Found ");
    };
    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const serverMasterExist = await serverMasterRepositry.findBy({
      serviceProvider:serviceProviderId,
    });
    if(serverMasterExist?.length > 0){
      throw new ValidationException("Unable To Delete , Service Provider Exist In Server Master !")
    };

    const domainMasterRepositry = appSource.getRepository(domainMaster);
    const domainMasterExist = await domainMasterRepositry.findBy({
      serviceProvider:serviceProviderId,
    });
    if(domainMasterExist?.length > 0){
      throw new ValidationException("Unable To Delete , Service Provider Exist In Domain Master !")
    }



    await serviceProviderRepositry
      .createQueryBuilder()
      .delete()
      .from(serviceProviderMaster)
      .where({ serviceProviderId: serviceProviderId })
      .andWhere({ companyId: companyId })
      .execute();
      const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '200',
                message: `Service Provider Details : ${serviceProviderFound.serviceProviderName} Deleted By User - `,
                companyId:companyId
              }
              await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${serviceProviderFound.serviceProviderName} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Deleting Service Provider Details : ${serviceProviderFound.serviceProviderName} - ${error.message} By User - `,
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
