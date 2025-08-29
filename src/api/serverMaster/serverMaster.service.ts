import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { serverMaster } from "./serverMaster.model";
import { ValidationException } from "../../core/exception";
import { serviceProviderMasterDto } from "../serviceProviderMaster/serviceProviderMaster.dto";
import {
  serverMasterDto,
  serverMasterStatus,
  serverMasterValidation,
} from "./serverMaster.dto";
import { serviceProviderMaster } from "../serviceProviderMaster/serviceProviderMaster.model";
import { Not } from "typeorm";
import { domainRegistration } from "../domainRegistration/domainRegistration.model";

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
  try {
    const payload: serverMasterDto = req.body;
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
      // const domainNameValidation = await serverMasterRepositry.findOneBy({
      //   domainName: payload.domainName,
      //   serverPlanId: Not(payload.serverPlanId),
      // });
      // if (domainNameValidation) {
      //   throw new ValidationException("Domain Name Already Exist ");
      // }

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
          res.status(200).send({
            IsSuccess: "Server Master Details Updated successFully",
          });
        })
        .catch(async (error) => {
          if (error instanceof ValidationException) {
            return res.status(400).send({
              message: error?.message,
            });
          }
          res.status(500).send(error);
        });
      return;
    } else {
      // const domainNameValidation = await serverMasterRepositry.findOneBy({
      //   domainName: payload.domainName,
      //   serverPlanId: Not(payload.serverPlanId),
      // });
      // if (domainNameValidation) {
      //   throw new ValidationException("Domain Name Already Exist ");
      // }
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
      const nameValidation = await serverMasterRepositry.findOneBy({
        serverPlan: payload.serverPlan,
        serverPlanId: Not(payload.serverPlanId),
      });
      if (nameValidation) {
        throw new ValidationException("Server Name Already Exist ");
      }
      await serverMasterRepositry.save(payload);
      res.status(200).send({
        IsSuccess: "Server Master Details Added successFully",
      });
    }
  } catch (error) {
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
  try {
    const serverMasterStatus: serverMasterStatus = req.body;
    const serverMasterRepositry = appSource.getRepository(serverMaster);
    const serverMasterFound = await serverMasterRepositry.findOneBy({
      serverPlanId: serverMasterStatus.serverPlanId,
      companyId: serverMasterStatus.companyId,
    });
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

    res.status(200).send({
      IsSuccess: `Status for ${serverMasterFound.serverPlan} Changed Successfully`,
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

export const deleteServerMaster = async (req: Request, res: Response) => {
  try {
    const serverPlanId = req.params.serverPlanId;
    const companyId = req.params.companyId;

    const serverMasterRepositry = appSource.getTreeRepository(serverMaster);
    const serverMasterFound = await serverMasterRepositry.findOneBy({
      serverPlanId: serverPlanId,
      companyId: companyId,
    });
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
    res.status(200).send({
      IsSuccess: `${serverMasterFound.serverPlan} Deleted Successfully `,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send(error);
  }
};
