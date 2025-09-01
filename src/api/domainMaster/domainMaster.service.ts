import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { domainMaster } from "./domainMaster.model";
import { ValidationException } from "../../core/exception";
import { domainMasterDto, domainMasterStatus, domainMasterValidation } from "./domaiMaster.dto";
import { Not } from "typeorm";

import { serviceProviderMaster } from "../serviceProviderMaster/serviceProviderMaster.model";
import { newCustomerRegistration } from "../newCustomer/newCustomer.model";
import { x } from "joi";
import { serverMaster } from "../serverMaster/serverMaster.model";
import { domainRegistration } from "../domainRegistration/domainRegistration.model";

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
  try {
    const payload: domainMasterDto = req.body;
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
      // const nameValidation = await domainMasterRepositry.findOneBy({
      //   domainName: payload.domainName,
      //   domainMasterId: Not(payload.domainMasterId),
      // });
      // if (nameValidation) {
      //   throw new ValidationException("Host Name Already Exist ");
      // }

      await domainMasterRepositry
        .update(
          {
            domainMasterId: payload.domainMasterId,
            companyId: payload.companyId,
          },
          payload
        )
        .then(async (r) => {
          res.status(200).send({
            IsSuccess: "Domain Master Details Updated SuccessFully",
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
      // const nameValidation = await hostingMasterRepository.findOneBy({
      //   hostingName: payload.hostingName,
      //   hostingId: Not(payload.hostingId),
      // });
      // if (nameValidation) {
      //   throw new ValidationException("Host Name Already Exist ");
      // }

      await domainMasterRepositry.save(payload);
      res.status(200).send({
        IsSuccess: "Domain Master Details Added SuccessFully",
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

    // console.log(serververMasterDetails, 'serverMaster')
    // console.log(domainRegistrationDetails, 'domain')

    res.status(200).send({
      Result: domainmaster,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};


export const updateStatus = async (req : Request , res : Response ) =>{
    try {
      const domainMasterStatus : domainMasterStatus = req.body;
      const domainMasterRepositry = appSource.getRepository(domainMaster);
      const domainMasterFound = await domainMasterRepositry.findOneBy({
        domainMasterId: domainMasterStatus.domainMasterId,
        companyId: domainMasterStatus.companyId,
      });
    
      if (!domainMasterFound) {
        throw new ValidationException("Domain Master Not Found ");
      }
  
      await domainMasterRepositry
        .createQueryBuilder()
        .update(domainMaster)
        .set({ status: domainMasterStatus.status })
        .where({ domainMasterId: domainMasterStatus.domainMasterId })
        .andWhere({ companyId: domainMasterStatus.companyId })
        .execute();
  
      res.status(200).send({
        IsSuccess: `Status Changed Successfully`,
      }); 
    } catch (error) {
      if (error instanceof ValidationException) {
        return res.status(400).send({
          message: error?.message,
        });
      }
      res.status(500).send(error);
    }
    
}



export const deleteDomainMaster = async (req: Request, res: Response) => {
  try {
    const domainMasterId = req.params.domainMasterId;
    const companyId = req.params.companyId;

    const domainMasterRepository = appSource.getTreeRepository(domainMaster);
    const domainMasterFound = await domainMasterRepository.findOneBy({
      domainMasterId: domainMasterId,
      companyId: companyId,
    });
    if (!domainMasterFound) {
      throw new ValidationException("Domain Master Not Found");
    }

    await domainMasterRepository
      .createQueryBuilder()
      .delete()
      .from(domainMaster)
      .where({ domainMasterId: domainMasterId })
      .andWhere({ companyId: companyId })
      .execute();
    res.status(200).send({
      IsSuccess: `${domainMasterFound.domainName} Deleted Successfully `,
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

