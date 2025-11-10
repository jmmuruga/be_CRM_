import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { domainMaster } from "./domainMaster.model";
import { ValidationException } from "../../../core/exception";
import { domainMasterDto, domainMasterStatus, domainMasterValidation } from "./domaiMaster.dto";
import { serviceProviderMaster } from "../serviceProviderMaster/serviceProviderMaster.model";
import { newCustomerRegistration } from "../../New Customer/newCustomer/newCustomer.model";
import { serverMaster } from "../serverMaster/serverMaster.model";
import { domainRegistration } from "../domainRegistration/domainRegistration.model";
import { InsertLog } from "../../Admin/logs/logs.service";
import { logsDto } from "../../Admin/logs/logs.dto";
import { getChangedProperty } from "../../../shared/helper";

export const getDomainMasterId = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const domainMasterRepositry = appSource.getRepository(domainMaster);
    let domainMasterId = await domainMasterRepositry.query(
      `SELECT domainMasterId
                    FROM [${process.env.DB_NAME}].[dbo].[domain_master] where companyId = ${companyId}
                    Group by domainMasterId
                    ORDER BY CAST(domainMasterId AS INT) DESC;`
    );

    let id = "0";
    if (domainMasterId?.length > 0) {
      id = domainMasterId[0].domainMasterId;
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

export const addUpdateDomainMaster = async (req: Request, res: Response) => {
  const payload: domainMasterDto = req.body;
  
  const userId = payload.isEdited? payload.editedBy_userId: payload.createdBy_userId;
  const companyId = payload.companyId;

  const domainRegRepositry = appSource.getRepository(domainRegistration);
  const domainNameDetails = await domainRegRepositry.findOneBy({
    domainNameId: payload.domainName,
    companyId: payload.companyId,
  });

  const domainDisplayName = domainNameDetails? domainNameDetails.domainName: payload.domainName;

  const serviceProviderMasterRepositry = appSource.getRepository(serviceProviderMaster);
  const serviceProviderDetails = await serviceProviderMasterRepositry.findOneBy({
    serviceProviderId:payload.serviceProvider,
    companyId: payload.companyId,
  });

  const serviceProviderDisplayName = serviceProviderDetails? serviceProviderDetails.serviceProviderName:payload.serviceProvider;

  try {
    const validation = domainMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const domainMasterRepositry = appSource.getRepository(domainMaster);
    const existingDetails = await domainMasterRepositry.findOneBy({
      domainMasterId: payload.domainMasterId,
      companyId: payload.companyId,
    });

    if (existingDetails) {
      await domainMasterRepositry
        .update(
          {
            domainMasterId: payload.domainMasterId,
            companyId: payload.companyId,
          },
          payload
        )
        .then(async () => {
          let updatedFields : string = await getChangedProperty([payload] , [existingDetails] )
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Domain Master Details For "${domainDisplayName} - ${serviceProviderDisplayName}" Updated - Changes : ${updatedFields} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);

          res.status(200).send({
            IsSuccess: "Domain Master Details Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Domain Master Details ${domainDisplayName} - ${serviceProviderDisplayName} - ${error.message} By User - `,
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
      await domainMasterRepositry.save(payload);

      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Domain Master Details ${domainDisplayName} - ${serviceProviderDisplayName} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);

      res.status(200).send({
        IsSuccess: "Domain Master Details Added Successfully",
      });
    }
  } catch (error: any) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Domain Master Details ${domainDisplayName} - ${serviceProviderDisplayName} - ${error.message} By User - `,
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


export const getDomainMasterDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;

    const domainMasterRepository = appSource.getRepository(domainMaster);
    const domainmaster = await domainMasterRepository
     .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    const domainRegistrationRepositry = appSource.getRepository(domainRegistration);
    const domainRegistrationDetails = await domainRegistrationRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    const serviceProviderMasterRepositry = appSource.getRepository(serviceProviderMaster);
    const serviceProviderMasterDetails = await serviceProviderMasterRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    const newCustomerRegistrationRepositry = appSource.getRepository(newCustomerRegistration);
    const newCustomerDetails = await newCustomerRegistrationRepositry
      .createQueryBuilder()
      .getMany();

    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const serververMasterDetails = await serverMasterRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    domainmaster.forEach((x) => {
      x["domain"] = domainRegistrationDetails.find(
        (y) => +y.domainNameId == +x.domainName
      ).domainName;
    });

    domainmaster.forEach((x) => {
      x["serviceproviderName"] = serviceProviderMasterDetails.find(
        (y) => +y.serviceProviderId == +x.serviceProvider
      ).serviceProviderName;
    });

    domainmaster.forEach((x) => {
      x["customername"] = newCustomerDetails.find(
        (y) => +y.customerId == +x.customerName
      ).customerName;
    });

    domainmaster.forEach((x) => {
      x["serverplan"] = serververMasterDetails.find(
        (y) => +y.serverPlanId == +x.serverPlan
      ).serverPlan;
    });


    res.status(200).send({
      Result: domainmaster,
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
  const domainMasterStatus: domainMasterStatus = req.body;

  const domainMasterRepositry = appSource.getRepository(domainMaster);
  const domainMasterFound = await domainMasterRepositry.findOneBy({
    domainMasterId: domainMasterStatus.domainMasterId,
    companyId: domainMasterStatus.companyId,
  });

  if (!domainMasterFound) {
    throw new ValidationException("Domain Master Not Found ");
  }

  const domainRegRepositry = appSource.getRepository(domainRegistration);
  const domainNameDetailFound = await domainRegRepositry.findOneBy({
    domainNameId: domainMasterFound.domainName, 
    companyId: domainMasterStatus.companyId,
  });
  const domainDisplayName = domainNameDetailFound? domainNameDetailFound.domainName : "Unknown Domain";

  const serviceProviderMasterRepositry =
    appSource.getRepository(serviceProviderMaster);
  const serviceProviderDetailsFound = await serviceProviderMasterRepositry.findOneBy({
      serviceProviderId: domainMasterFound.serviceProvider,
      companyId: domainMasterStatus.companyId,
    });
  const serviceProviderDisplayName = serviceProviderDetailsFound ? serviceProviderDetailsFound.serviceProviderName : "Unknown Service Provider";

  try {
    await domainMasterRepositry
      .createQueryBuilder()
      .update(domainMaster)
      .set({ status: domainMasterStatus.status })
      .where({ domainMasterId: domainMasterStatus.domainMasterId })
      .andWhere({ companyId: domainMasterStatus.companyId })
      .execute();

    const logsPayload: logsDto = {
      userId: domainMasterStatus.userId,
      userName: null,
      statusCode: "200",
      message: `Domain Master Status For ${domainDisplayName} - ${serviceProviderDisplayName} Changed to ${domainMasterStatus.status} By User - `,
      companyId: domainMasterStatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Changed Successfully`,
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      userId: domainMasterStatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Status For ${domainDisplayName} - ${serviceProviderDisplayName} to ${domainMasterStatus.status} - ${error.message} By User - `,
      companyId: domainMasterStatus.companyId,
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


export const deleteDomainMaster = async (req: Request, res: Response) => {
  const { domainMasterId, companyId, userId } = req.params;

  const domainMasterRepository = appSource.getRepository(domainMaster);
  const domainMasterFound = await domainMasterRepository.findOneBy({
    domainMasterId: domainMasterId,companyId: companyId,
  });

  if (!domainMasterFound) {
    throw new ValidationException("Domain Name Not Found ");
    }

  const domainRegRepositry = appSource.getRepository(domainRegistration);
  const domainNameDetails = await domainRegRepositry.findOneBy({
    domainNameId: domainMasterFound.domainName,companyId: companyId,
  });
  const domainDisplayName = domainNameDetails? domainNameDetails.domainName: "Unknown Domain";

  const serviceProviderMasterRepositry = appSource.getRepository(serviceProviderMaster);
  const serviceProviderDetails = await serviceProviderMasterRepositry.findOneBy({
      serviceProviderId: domainMasterFound.serviceProvider,companyId: companyId
    });
  const serviceProviderDisplayName = serviceProviderDetails? serviceProviderDetails.serviceProviderName:"Unknown Service Provider";

  try {
    await domainMasterRepository
      .createQueryBuilder()
      .delete()
      .from(domainMaster)
      .where({ domainMasterId: domainMasterId })
      .andWhere({ companyId: companyId })
      .execute();

    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Domain Master Deleted : '${domainDisplayName} - ${serviceProviderDisplayName} Deleted By User - `,
      companyId: companyId
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: ` '${domainDisplayName} - ${serviceProviderDisplayName}') Deleted Successfully`,
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting ${domainDisplayName} - ${serviceProviderDisplayName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};


