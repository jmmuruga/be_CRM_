import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { serviceProviderMaster } from "./serviceProviderMaster.model";
import { ValidationException } from "../../core/exception";
import {
  serviceProviderMasterDto,
  serviceProviderMasterStatus,
  serviceProviderMasterValidation,
} from "./serviceProviderMaster.dto";

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
  try {
    const payload: serviceProviderMasterDto = req.body;
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
          res.status(200).send({
            IsSuccess: "Service Provider Details Updated successFully",
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
      const nameValidation = await serviceProviderRepositry.findOneBy({
        serviceProviderName: payload.serviceProviderName,
        companyId: payload.companyId,
      });
      if (nameValidation) {
        throw new ValidationException("Service Provider Already Exist ");
      }
      await serviceProviderRepositry.save(payload);
      res.status(200).send({
        IsSuccess: "Details Added successFully",
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
  try {
    const serviceProviderStatus: serviceProviderMasterStatus = req.body;
    const serviceProviderRepositry = appSource.getRepository(
      serviceProviderMaster
    );
    const serviceProviderFound = await serviceProviderRepositry.findOneBy({
      serviceProviderId: serviceProviderStatus.serviceProviderId,
      companyId: serviceProviderStatus.companyId,
    });
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

    res.status(200).send({
      IsSuccess: `Status for ${serviceProviderFound.serviceProviderName} Changed Successfully`,
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

export const deleteServiceProviderDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const serviceProviderId = req.params.serviceProviderId;
    const companyId = req.params.companyId;

    const serviceProviderRepositry = appSource.getTreeRepository(
      serviceProviderMaster
    );
    const serviceProviderFound = await serviceProviderRepositry.findOneBy({
      serviceProviderId: serviceProviderId,
      companyId: companyId,
    });
    if (!serviceProviderFound) {
      throw new ValidationException("Service Provider Not Found ");
    }

    await serviceProviderRepositry
      .createQueryBuilder()
      .delete()
      .from(serviceProviderMaster)
      .where({ serviceProviderId: serviceProviderId })
      .andWhere({ companyId: companyId })
      .execute();

    res.status(200).send({
      IsSuccess: `${serviceProviderFound.serviceProviderName} Deleted Successfully `,
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
