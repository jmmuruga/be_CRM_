import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { Request, Response } from "express";
import { newCustomerRegistration } from "./newCustomer.model";
import {
  customerDetailsStatus,
  newCustomerRegistrationDto,
  newCustomerRegistrationValidation,
} from "./newCustomer.dto";
import { Not } from "typeorm";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { getChangedProperty } from "../../../shared/helper";
import { hostingMaster } from "../../Master/hostingMaster/hostingMaster.model";
import { domainMaster } from "../../Master/domainMaster/domainMaster.model";

export const getCustomerId = async (req: Request, res: Response) => {
  try {
    const newCustomerRegistrationRepositry = appSource.getRepository(
      newCustomerRegistration
    );
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

export const addUpdateCustomerRegistration = async (
  req: Request,
  res: Response
) => {
  const payload: newCustomerRegistrationDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;
  try {
    const validation = newCustomerRegistrationValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const newCustomerRegistrationrepositry = appSource.getRepository(
      newCustomerRegistration
    );

    const existingDetails = await newCustomerRegistrationrepositry.findOneBy({
      customerId: payload.customerId,
    });

    delete payload.companyId;

    if (existingDetails) {
      const emailValidation = await newCustomerRegistrationrepositry.findOneBy({
        Email: payload.Email,
        customerId: Not(payload.customerId),
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist");
      }

      const mobileValidation = await newCustomerRegistrationrepositry.findOneBy(
        {
          Mobile: payload.Mobile,
          customerId: Not(payload.customerId),
        }
      );
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist");
      }

      await newCustomerRegistrationrepositry
        .update({ customerId: payload.customerId }, payload)
        .then(async () => {
          let updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Customer Details For "${payload.customerName}" Updated - Changes : ${updatedFields}By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Customer Details Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Customer Details ${payload.customerName} - ${error.message} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          if (error instanceof ValidationException) {
            return res.status(400).send({
              message: error?.message,
            });
          }
          res.status(500).send(error);
        });
      return;
    } else {
      const emailValidation = await newCustomerRegistrationrepositry.findOneBy({
        Email: payload.Email,
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist");
      }

      const mobileValidation = await newCustomerRegistrationrepositry.findOneBy(
        {
          Mobile: payload.Mobile,
        }
      );
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist");
      }

      await newCustomerRegistrationrepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Customer Details ${payload.customerName} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Customer Details Added Successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Customer Details ${payload.customerName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getCustomerDetails = async (req: Request, res: Response) => {
  try {
    const newCustomerRegistrationRepositry = appSource.getRepository(
      newCustomerRegistration
    );
    const customers = await newCustomerRegistrationRepositry
      .createQueryBuilder("")
      .getMany();
    res.status(200).send({
      Result: customers,
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
  const customerstatus: customerDetailsStatus = req.body;
  const newCustomerRegistrationRepositry = appSource.getRepository(
    newCustomerRegistration
  );
  const customerFound = await newCustomerRegistrationRepositry.findOneBy({
    customerId: customerstatus.customerId,
  });
  try {
    if (!customerFound) {
      throw new ValidationException("Customer Not Found");
    }

    await newCustomerRegistrationRepositry
      .createQueryBuilder()
      .update(newCustomerRegistration)
      .set({ status: customerstatus.status })
      .where({ customerId: customerstatus.customerId })
      .execute();
    const logsPayload: logsDto = {
      userId: customerstatus.userId,
      userName: null,
      statusCode: "200",
      message: `Customer Status For ${customerFound.customerName} changed to ${customerstatus.status} by user - `,
      companyId: customerstatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for ${customerFound.customerName} Changed Successfully`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: customerstatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Customer Status For ${customerFound.customerName} to ${customerstatus.status} - ${error.message} by user - `,
      companyId: customerstatus.companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const deleteCustomerDetails = async (req: Request, res: Response) => {
  const { customerId, userId, companyId } = req.params;
  const newCustomerRegistrationRepositry = appSource.getTreeRepository(
    newCustomerRegistration
  );
  const customerFound = await newCustomerRegistrationRepositry.findOneBy({
    customerId: customerId,
  });
  try {
    if (!customerFound) {
      throw new ValidationException("Customer Not Found ");
    }

    const hostingMasterRepositry = appSource.getRepository(hostingMaster);
    const hostingMasterExist = await hostingMasterRepositry.findBy({customerName : customerId});
    if(hostingMasterExist?.length > 0){
      throw new ValidationException("Unable To Delete , Customer Exist In Hosting Master !");
    };

    const domainMasterRepositry = appSource.getRepository(domainMaster);
    const domainMasterExist = await domainMasterRepositry.findBy({
      customerName:customerId
    });
    if(domainMasterExist?.length > 0){
      throw new ValidationException("Unable To Delete , Customer Exist In Domain Master !");
    };
    await newCustomerRegistrationRepositry
      .createQueryBuilder()
      .delete()
      .from(newCustomerRegistration)
      .where({ customerId: customerId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Customer Details : ${customerFound.customerName} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${customerFound.customerName} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Customer Details : ${customerFound.customerName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }

    res.status(500).send(error);
  }
};
