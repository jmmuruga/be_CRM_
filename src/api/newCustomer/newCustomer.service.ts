import { appSource } from "../../core/dataBase/db";
import { ValidationException } from "../../core/exception";
import { Request, Response } from "express";
import { newCustomerRegistration } from "./newCustomer.model";
import { newCustomerRegistrationDto, newCustomerRegistrationValidation } from "./newCustomer.dto";
import { Not } from "typeorm";


export const getCustomerId = async (req: Request, res: Response) => {
  try {
    const newCustomerRegistrationRepositry =
      appSource.getRepository(newCustomerRegistration);
    let customerId = await newCustomerRegistrationRepositry.query(
      `SELECT customerId
            FROM [${process.env.DB_NAME}].[dbo].[new_customer_registration]
            Group by customerId
            ORDER BY CAST(customerId AS INT) DESC;`
    );

    let id = "0";
    if (customerId?.length > 0) {
      id = customerId[0].customerId;
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

  export const addUpdateNewCustomerRegistration = async (
    req: Request,
    res: Response
  ) => {
    try {
      const payload: newCustomerRegistrationDto = req.body;
      const validation = newCustomerRegistrationValidation.validate(payload);
      if (validation.error) {
        throw new ValidationException(validation.error.message);
      }

      const newCustomerRegistrationrepositry =
        appSource.getRepository(newCustomerRegistration);

      const existingDetails = await newCustomerRegistrationrepositry.findOneBy({
        customerId: payload.customerId,
      });

      if (existingDetails) {
        // const companyNameAndBranchValidation =
        //   await newCustomerRegistrationrepositry.findOneBy({
        //     companyName: payload.companyName,
        //     Branch: payload.Branch,
        //     companyId: Not(payload.companyId),
        //   });
        // if (companyNameAndBranchValidation) {
        //   throw new ValidationException(
        //     "Branch already exists for this Company."
        //   );
        // }

        const emailValidation = await newCustomerRegistrationrepositry.findOneBy({
          email: payload.Email,
          customerId: Not(payload.customerId),
        });
        if (emailValidation) {
          throw new ValidationException("Email Address Already Exist");
        }

        const mobileValidation = await newCustomerRegistrationrepositry.findOneBy({
          mobile: payload.Mobile,
          customerId: Not(payload.customerId),
        });
        if (mobileValidation) {
          throw new ValidationException("Mobile Number Already Exist");
        }

        await newCustomerRegistrationrepositry
          .update({ customerId: payload.customerId }, payload)
          .then(() => {
            res.status(200).send({
              IsSuccess: "Customer Details Updated Successfully",
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


        const emailValidation = await newCustomerRegistrationrepositry.findOneBy({
          email: payload.Email,
        });
        if (emailValidation) {
          throw new ValidationException("Email Address Already Exist");
        }

        const mobileValidation = await newCustomerRegistrationrepositry.findOneBy({
          mobile: payload.Mobile,
        });
        if (mobileValidation) {
          throw new ValidationException("Mobile Number Already Exist");
        }

        await newCustomerRegistrationrepositry.save(payload);
        res.status(200).send({
          IsSuccess: "Customer Details Added Successfully",
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
