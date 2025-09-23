import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { hostingMaster } from "./hostingMaster.model";
import { ValidationException } from "../../core/exception";
import {
  hostingMasterDto,
  hostingMasterStatus,
  hostingMasterValidation,
} from "./hostingMaster.dto";
import { serverMaster } from "../serverMaster/serverMaster.model";
import { Not } from "typeorm";
import { domainRegistration } from "../domainRegistration/domainRegistration.model";
import { newCustomerRegistration } from "../newCustomer/newCustomer.model";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { getChangedProperty } from "../../shared/helper";

export const getHostingId = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const hostingMasterRepository = appSource.getRepository(hostingMaster);

    const hostingId = await hostingMasterRepository.query(
      `SELECT hostingId
       FROM [${process.env.DB_NAME}].[dbo].[hosting_master]
      where companyId = ${companyId}
       GROUP BY hostingId
       ORDER BY CAST(hostingId AS INT) DESC;`
    );

    let id = "0";
    if (hostingId?.length > 0) {
      id = hostingId[0].hostingId;
    }
    const finalRes = Number(id) + 1;

    res.status(200).send({ Result: finalRes });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const addUpdateHostingMaster = async (req: Request, res: Response) => {
  const payload: hostingMasterDto = req.body;
  const userId = payload.isEdited? payload.editedBy_userId : payload.createdBy_userId;
  const companyId = payload.companyId;
  try {
    const validation = hostingMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const hostingMasterRepository = appSource.getRepository(hostingMaster);
    const existingDetails = await hostingMasterRepository.findOneBy({
      hostingId: payload.hostingId,
      companyId: payload.companyId,
    });
    if (existingDetails) {
      const nameValidation = await hostingMasterRepository.findOneBy({
        hostingName: payload.hostingName,
        hostingId: Not(payload.hostingId),
      });
      if (nameValidation) {
        throw new ValidationException("Host Name Already Exist ");
      }

      await hostingMasterRepository
        .update(
          { hostingId: payload.hostingId, companyId: payload.companyId },
          payload
        )
        .then(async (r) => {
          let updatedFields : string = await getChangedProperty([payload],[existingDetails])
          const logsPayload: logsDto = {
                                userId: userId,
                                userName: null,
                                statusCode: "200",
                                message: `Hosting Master Details For "${payload.hostingName}" Updated - Changes : ${updatedFields} By User - `,
                                companyId: companyId,
                              };
                              await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Hosting Master Details Updated successFully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Updating Hosting Master Details ${payload.hostingName} - ${error.message} By User - `,
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
      const nameValidation = await hostingMasterRepository.findOneBy({
        hostingName: payload.hostingName,
        hostingId: Not(payload.hostingId),
      });
      if (nameValidation) {
        throw new ValidationException("Host Name Already Exist ");
      }

      await hostingMasterRepository.save(payload);
      const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '200',
                message: `Hosting Master Details ${payload.hostingName} Added By User - `,
                companyId: companyId
              }
              await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Hosting Master Details Added successFully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
                userId: userId,
                userName: null,
                statusCode: '400',
                message: `Error While Adding Hosting Master Details ${payload.hostingName} - ${error.message} By User - `,
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

export const getHostingMasterDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;

        const domainRegistrationRepositry = appSource.getRepository(domainRegistration);
        const domainRegistrationDetails = await domainRegistrationRepositry
        .createQueryBuilder()
        .where({companyId:companyId})
        .getMany()


        const newCustomerRegistrationRepositry = appSource.getRepository(newCustomerRegistration);
            const newCustomerDetails = await newCustomerRegistrationRepositry
              .createQueryBuilder()
              .getMany();
        

    
    
    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const serververMasterDetails = await serverMasterRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    const hostingMasterRepository = appSource.getRepository(hostingMaster);
    const hostMaster = await hostingMasterRepository
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();
    
        hostMaster.forEach((x) => {
          x["domain"] = domainRegistrationDetails.find((y)=> +y.domainNameId == +x.domainName).domainName;
        });
    
    hostMaster.forEach((x) => {
      x["serverName"] = serververMasterDetails.find(
        (y) => +y.serverPlanId == +x.server
      ).serverPlan;
    });

    hostMaster.forEach((x) => {
      x["customername"] = newCustomerDetails.find(
        (y) => +y.customerId == +x.customerName
      ).customerName;
    });

    // console.log(serververMasterDetails , 'serverMaster')
    //  console.log(domainRegistrationDetails , ' domain')

    res.status(200).send({
      Result: hostMaster,
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
  const hostStatus: hostingMasterStatus = req.body;
    const hostingMasterRepository = appSource.getRepository(hostingMaster);
    const hostFound = await hostingMasterRepository.findOneBy({
      hostingId: hostStatus.hostingId,
      companyId: hostStatus.companyId,
    });
  try {
    
    if (!hostFound) {
      throw new ValidationException("Host Name Not Found");
    }

    await hostingMasterRepository
      .createQueryBuilder()
      .update(hostingMaster)
      .set({ status: hostStatus.status })
      .where({ hostingId: hostStatus.hostingId })
      .andWhere({ companyId: hostStatus.companyId })
      .execute();
      const logsPayload: logsDto = {
                userId: hostStatus.userId,
                userName: null,
                statusCode: '200',
                message: `Hosting Master Status For ${hostFound.hostingName} Changed To ${hostStatus.status} By User - `,
                companyId: hostStatus.companyId
              }
              await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for ${hostFound.hostingId} Changed Successfully`,
    });
  } catch (error) {
     const logsPayload: logsDto = {
                userId: hostStatus.userId,
                userName: null,
                statusCode: '400',
                message: `Error While Changing Hosting Master Status For ${hostFound.hostingName} to ${hostStatus.status} - ${error.message} By User - `,
                companyId: hostStatus.companyId
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

export const deleteHostingMasterDetails = async (
  req: Request,
  res: Response
) => {
   const hostingId = req.params.hostingId;
    const  { companyId, userId } = req.params;
    const hostingMasterRepository = appSource.getTreeRepository(hostingMaster);
    const hostFound = await hostingMasterRepository.findOneBy({
      hostingId: hostingId,
      companyId: companyId,
    });
  try {
    if (!hostFound) {
      throw new ValidationException("Host Name  Not Found ");
    }

    await hostingMasterRepository
      .createQueryBuilder()
      .delete()
      .from(hostingMaster)
      .where({ hostingId: hostingId })
      .andWhere({ companyId: companyId })
      .execute();

      const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Hosting Master Details : ${hostFound.hostingName} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${hostFound.hostingName} Deleted Successfully `,
    });
  } catch (error) {
   const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Hosting Master Details : ${hostFound.hostingName} - ${error.message} By User - `,
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
