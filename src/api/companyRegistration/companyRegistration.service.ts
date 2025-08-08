import { appSource } from "../../core/dataBase/db";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { companyRegistration } from "./companyRegistration.model";
import {companyRegistrationDto,companyRegistrationValidation} from "./companyRegistration.dto";

export const getCompanyId = async (req: Request, res: Response) => {
  try {
    const companyRegistrationRepositry =
      appSource.getRepository(companyRegistration);
    let companyId = await companyRegistrationRepositry.query(
      `SELECT companyId
            FROM [${process.env.DB_NAME}].[dbo].[company_registration]
            Group by companyId
            ORDER BY CAST(companyId AS INT) DESC;`
    );

    let id = "0";
    if (companyId?.length > 0) {
      id = companyId[0].companyId;
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
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const companyRegistrationRepositry =
      appSource.getRepository(companyRegistration);
    const existingDetails = await companyRegistrationRepositry.findOneBy({
      companyId: payload.companyId,
    });
    if (existingDetails) {
      await companyRegistrationRepositry
        .update({ companyId: payload.companyId }, payload)
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
      const nameValidation = await companyRegistrationRepositry.findOneBy({
        companyName: payload.companyName,
      });
      if (nameValidation) {
        throw new ValidationException("Company Name Already Exist ");
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

export const getCompanyDetails = async(req : Request , res : Response) =>{
  try{
    const companyRegistrationRepositry = appSource.getRepository(companyRegistration);
    const companies = await companyRegistrationRepositry
    .createQueryBuilder('')
    .getMany();
    res.status(200).send({
        Result: companies
      });
  }
  catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
}