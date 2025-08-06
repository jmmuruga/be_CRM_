import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { domainMaster } from "./domainMaster.model";
import { ValidationException } from "../../core/exception";
import { domainRegistrationDto } from "../domainRegistration/domainRegistration.dto";
import { domainMasterDto, domainMasterValidation } from "./domaiMaster.dto";

export const getServiceProviderId = async (req: Request, res: Response) => {
  try {
    const domainMasterRepositry = appSource.getRepository(domainMaster);
    let serviceProviderId = await domainMasterRepositry.query(
      `SELECT serviceProviderId
                    FROM [${process.env.DB_NAME}].[dbo].[domain_master]
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

export const addUpdateDomainMaster = async (req: Request, res: Response) => {
  try {
    const payload: domainMasterDto = req.body;

    const validation = domainMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const domainMasterRepositry = appSource.getRepository(domainMaster);

    const existingDetails = await domainMasterRepositry.findOneBy({
      serviceProviderId: payload.serviceProviderId,
    });

    if (existingDetails) {
      await domainMasterRepositry.update(
        { serviceProviderId: payload.serviceProviderId },
        payload
      );
      res.status(200).send({
        IsSuccess: "Domain Master Details Updated successfully",
      });
    } else {
      const nameValidation = await domainMasterRepositry.findOneBy({
        domainName: payload.domainName,
      });

      if (nameValidation) {
        throw new ValidationException("Domain Name Already Exist");
      }

      await domainMasterRepositry.save(payload);
      res.status(200).send({
        IsSuccess: "Domain Master Details Added successfully",
      });
    }
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send(error);
  }
};
