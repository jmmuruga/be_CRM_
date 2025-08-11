import { appSource } from "../../core/dataBase/db";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { companyRegistration } from "./companyRegistration.model";
import {
  companyRegistrationDto,
  companyRegistrationValidation,
} from "./companyRegistration.dto";
import { Not } from "typeorm";

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
      const companyNameAndBranchValidation =
        await companyRegistrationRepositry.findOneBy({
          companyName: payload.companyName,
          Branch: payload.Branch,
          companyId: Not(payload.companyId),
        });
      if (companyNameAndBranchValidation) {
        throw new ValidationException(
          "Branch already exists for this Company."
        );
      }

  

      const emailValidation = await companyRegistrationRepositry.findOneBy({
        Email: payload.Email,
        companyId: Not(payload.companyId),
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist");
      }

      const mobileValidation = await companyRegistrationRepositry.findOneBy({
        Mobile: payload.Mobile,
        companyId: Not(payload.companyId),
      });
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist");
      }

      await companyRegistrationRepositry
        .update({ companyId: payload.companyId }, payload)
        .then(() => {
          res.status(200).send({
            IsSuccess: "Company Details Updated successfully",
          });
        })
        .catch((error) => {
          if (error instanceof ValidationException) {
            return res.status(400).send({
              message: error?.message,
            });
          }
          res.status(500).send(error);
        });
      return;
    } else {
      const companyNameAndBranchValidation =
        await companyRegistrationRepositry.findOneBy({
          companyName: payload.companyName,
          Branch: payload.Branch,
        });
      if (companyNameAndBranchValidation) {
        throw new ValidationException(
          "Branch already exists for this company."
        );
      }


      const emailValidation = await companyRegistrationRepositry.findOneBy({
        Email: payload.Email,
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist");
      }

      const mobileValidation = await companyRegistrationRepositry.findOneBy({
        Mobile: payload.Mobile,
      });
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist");
      }

      await companyRegistrationRepositry.save(payload);
      res.status(200).send({
        IsSuccess: "Company Details Added successfully",
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


export const getCompanyDetails = async (req: Request, res: Response) => {
  try {
    const companyRegistrationRepositry =
      appSource.getRepository(companyRegistration);
    const companies = await companyRegistrationRepositry
      .createQueryBuilder("")
      .getMany();
    res.status(200).send({
      Result: companies,
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

export const updateCompanyStatus = async (req: Request, res: Response) => {
  try {
    const companystatus: companyRegistration = req.body;
    const companyRegistrationRepositry =
      appSource.getRepository(companyRegistration);
    const companyFound = await companyRegistrationRepositry.findOneBy({
      companyId: companystatus.companyId,
    });
    if (!companyFound) {
      throw new ValidationException("Company Not Found");
    }
    await companyRegistrationRepositry
      .createQueryBuilder()
      .update(companyRegistration)
      .set({ status: companystatus.status })
      .where({ companyId: companystatus.companyId })
      .execute();

    res.status(200).send({
      IsSuccess: `Status for ${companyFound.companyName} Changed Successfully`,
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

export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const companyRepositry = appSource.getTreeRepository(companyRegistration);
    const companyFound = await companyRepositry.findOneBy({
      companyId: companyId,
    });
    if (!companyFound) {
      throw new ValidationException("Company Not Found ");
    }

    await companyRepositry
      .createQueryBuilder()
      .delete()
      .from(companyRegistration)
      .where({ companyId: companyId })
      .execute();

    res.status(200).send({
      IsSuccess: `${companyFound.companyName} Deleted Successfully `,
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
