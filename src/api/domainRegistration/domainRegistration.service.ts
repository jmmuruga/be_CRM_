import { appSource } from "../../core/dataBase/db";
import { domainRegistration } from "./domainRegistration.model";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { domainRegistrationDto, domainRegistrationStatus, domainRegistrationValidation } from "./domainRegistration.dto";

export const getDomainNameId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const domainRegistrationRepositry =
      appSource.getRepository(domainRegistration);
    let domainNameId = await domainRegistrationRepositry.query(
      `SELECT domainNameId
            FROM [${process.env.DB_NAME}].[dbo].[domain_registration] where companyId = ${companyid}
            Group by domainNameId
            ORDER BY CAST(domainNameId AS INT) DESC;`
    );

    let id = "0";
    if (domainNameId?.length > 0) {
      id = domainNameId[0].domainNameId;
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

export const addUpdateDomainRegistration = async (
  req: Request,
  res: Response
) => {
  try {
    const payload: domainRegistrationDto = req.body;
    const validation = domainRegistrationValidation.validate(payload);
    if(validation.error){
         throw new ValidationException(
                validation.error.message
            );
    }
    const domainRegistrationRepositry =
      appSource.getRepository(domainRegistration);
    const existingDetails = await domainRegistrationRepositry.findOneBy({
      domainNameId: payload.domainNameId,companyId:payload.companyId
    });
    if (existingDetails) {
      const nameValidation = await domainRegistrationRepositry.findOneBy({domainName:payload.domainName,companyId:payload.companyId})
        if (nameValidation){
            throw new ValidationException(
                'Domain Name Already Exist '
            );

        }
      await domainRegistrationRepositry
        .update({ domainNameId: payload.domainNameId,companyId:payload.companyId  }, payload)
        .then(async (r) => {
          res.status(200).send({
            IsSuccess: "Domain Registration Details Updated successFully",
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
        const nameValidation = await domainRegistrationRepositry.findOneBy({domainName:payload.domainName,companyId:payload.companyId})
        if (nameValidation){
            throw new ValidationException(
                'Domain Name Already Exist '
            );

        }
      await domainRegistrationRepositry.save(payload);
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


export const getDomainRegistrationDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId
    const domainRegistrationRepositry = appSource.getRepository(
      domainRegistration
    );
    const domainReg = await domainRegistrationRepositry
      .createQueryBuilder("")
      .where ({companyId:companyId})
      .getMany();
    res.status(200).send({
      Result: domainReg,
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
    const domainRegStatus: domainRegistrationStatus = req.body;
    const domainRegistrationRepositry = appSource.getRepository(
      domainRegistration
    );
    const domainRegFound = await domainRegistrationRepositry.findOneBy({
      domainNameId: domainRegStatus.domainNameId,companyId:domainRegStatus.companyId
    });
    if (!domainRegFound) {
      throw new ValidationException("Domain Name Not Found");
    }

    await domainRegistrationRepositry
      .createQueryBuilder()
      .update(domainRegistration)
      .set({ status: domainRegStatus.status })
      .where({ domainNameId: domainRegStatus.domainNameId})
      .andWhere({companyId:domainRegStatus.companyId})
      .execute();

    res.status(200).send({
      IsSuccess: `Status for ${domainRegFound.domainName} Changed Successfully`,
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


export const deleteDomainRegistrationDetails = async (req: Request, res: Response) => {
  try {
    const domainNameId = req.params.domainNameId;
    const companyId = req.params.companyId
    const domainRegistrationRepositry = appSource.getTreeRepository(domainRegistration);
    const domainRegFound = await domainRegistrationRepositry.findOneBy({
      domainNameId: domainNameId,companyId:companyId
    });
    if (!domainRegFound) {
      throw new ValidationException("Domain Name  Not Found ");
    }

    await domainRegistrationRepositry
      .createQueryBuilder()
      .delete()
      .from(domainRegistration)
      .where({ domainNameId: domainNameId })
      .andWhere ({companyId:companyId})
      .execute();

    res.status(200).send({
      IsSuccess: `${domainRegFound.domainName} Deleted Successfully `,
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


