import { Not } from "typeorm";
import { appSource } from "../../core/dataBase/db";
import { ValidationException } from "../../core/exception";
import { employeeRegistrationValidation } from "./employeeRegistration.dto";
import { employeeRegistration } from "./employeeRegistration.model";
import { Request, Response } from "express";

export const getEmployeeId = async (req: Request, res: Response) => {
  try {
    const employeeRegistrationRepositry =
      appSource.getRepository(employeeRegistration);
    let employeeId = await employeeRegistrationRepositry.query(
      `SELECT employeeId
            FROM [${process.env.DB_NAME}].[dbo].[employee_registration]
            Group by employeeId
            ORDER BY CAST(employeeId AS INT) DESC;`
    );

    let id = "0";
    if (employeeId?.length > 0) {
      id = employeeId[0].employeeId;
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

  export const addUpdateEmployeeRegistration = async (
    req: Request,
    res: Response
  ) => {
    try {
      const payload: employeeRegistration = req.body;
      const validation = employeeRegistrationValidation.validate(payload);
      if (validation.error) {
        throw new ValidationException(validation.error.message);
      }

      const employeeRegistrationRepositry =
        appSource.getRepository(employeeRegistration);

      const existingDetails = await employeeRegistrationRepositry.findOneBy({
        employeeId: payload.employeeId,
      });

      if (existingDetails) {
        // const companyNameAndBranchValidation =
        //   await companyRegistrationRepositry.findOneBy({
        //     companyName: payload.companyName,
        //     Branch: payload.Branch,
        //     companyId: Not(payload.companyId),
        //   });
        // if (companyNameAndBranchValidation) {
        //   throw new ValidationException(
        //     "Branch already exists for this Company."
        //   );
        // }

        const emailValidation = await employeeRegistrationRepositry.findOneBy({
          employeeEmail: payload.employeeEmail,
          employeeId: Not(payload.employeeId),
        });
        if (emailValidation) {
          throw new ValidationException("Email Address Already Exist");
        }

        const mobileValidation = await employeeRegistrationRepositry.findOneBy({
          employeeMobile: payload.employeeMobile,
          employeeId: Not(payload.employeeId),
        });
        if (mobileValidation) {
          throw new ValidationException("Mobile Number Already Exist");
        }

        await employeeRegistrationRepositry
          .update({ employeeId: payload.employeeId }, payload)
          .then(() => {
            res.status(200).send({
              IsSuccess: "Employee Details Updated Successfully",
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
        // const companyNameAndBranchValidation =
        //   await companyRegistrationRepositry.findOneBy({
        //     companyName: payload.companyName,
        //     Branch: payload.Branch,
        //   });
        // if (companyNameAndBranchValidation) {
        //   throw new ValidationException(
        //     "Branch already exists for this company."
        //   );
        // }


        const emailValidation = await employeeRegistrationRepositry.findOneBy({
          employeeEmail: payload.employeeEmail,
        });
        if (emailValidation) {
          throw new ValidationException("Email Address Already Exist");
        }

        const mobileValidation = await employeeRegistrationRepositry.findOneBy({
          employeeMobile: payload.employeeMobile,
        });
        if (mobileValidation) {
          throw new ValidationException("Mobile Number Already Exist");
        }

        await employeeRegistrationRepositry.save(payload);
        res.status(200).send({
          IsSuccess: "Employee Details Added successfully",
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