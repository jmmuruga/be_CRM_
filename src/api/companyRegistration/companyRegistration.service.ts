import { appSource } from "../../core/dataBase/db";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { companyRegistration } from "./companyRegistration.model";
import { companyRegistrationDto, companyRegistrationValidation } from "./companyRegistration.dto";

export const getCompanyNameId = async (req: Request, res: Response) => {
  try {
    const companyRegistrationRepositry =
      appSource.getRepository(companyRegistration);
    let companyNameId = await companyRegistrationRepositry.query(
      `SELECT companyNameId
            FROM [${process.env.DB_NAME}].[dbo].[company_registration]
            Group by companyNameId
            ORDER BY CAST(companyNameId AS INT) DESC;`
    );

    let id = "0";
    if (companyNameId?.length > 0) {
      id = companyNameId[0].companyNameId;
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

export const addUpdateCompanyRegistration = async (
  req: Request,
  res: Response
) => {
  try {
    const payload: companyRegistrationDto = req.body;
    const validation = companyRegistrationValidation.validate(payload);
    if(validation.error){
         throw new ValidationException(
                validation.error.message
            );
    }
    const companyRegistrationRepositry =
      appSource.getRepository(companyRegistration);
    const existingDetails = await companyRegistrationRepositry.findOneBy({
      companyNameId: payload.companyNameId,
    });
    if (existingDetails) {
      await companyRegistrationRepositry
        .update({ companyNameId: payload.companyNameId }, payload)
        .then(async (r) => {
          res.status(200).send({
            IsSuccess: "Company Details Updated successFully",
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
        const nameValidation = await companyRegistrationRepositry.findOneBy({companyNameId:payload.companyNameId})
        if (nameValidation){
            throw new ValidationException(
                'Company Name Already Exist '
            );

        }
      await companyRegistrationRepositry.save(payload);
      res.status(200).send({
            IsSuccess: "Company Details Added successFully",
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
