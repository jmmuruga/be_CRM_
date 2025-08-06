import { appSource } from "../../core/dataBase/db";
import { domainRegistration } from "./domainRegistration.model";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { domainRegistrationDto, domainRegistrationValidation } from "./domainRegistration.dto";

export const getDomainNameId = async (req: Request, res: Response) => {
  try {
    const domainRegistrationRepositry =
      appSource.getRepository(domainRegistration);
    let domainNameId = await domainRegistrationRepositry.query(
      `SELECT domainNameId
            FROM [${process.env.DB_NAME}].[dbo].[domain_registration]
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
      domainNameId: payload.domainNameId,
    });
    if (existingDetails) {
      await domainRegistrationRepositry
        .update({ domainNameId: payload.domainNameId }, payload)
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
        const nameValidation = await domainRegistrationRepositry.findOneBy({domainName:payload.domainName})
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
