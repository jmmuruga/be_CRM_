import { Not } from "typeorm";
import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import {
  EmployeeDetailsStatus,
  employeeRegistrationDto,
  employeeRegistrationValidation,
} from "./employeeRegistration.dto";
import { employeeRegistration } from "./employeeRegistration.model";
import { Request, Response } from "express";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { getChangedProperty } from "../../../shared/helper";

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
  const payload: employeeRegistrationDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;
  try {
    const validation = employeeRegistrationValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const employeeRegistrationRepositry =
      appSource.getRepository(employeeRegistration);

    const existingDetails = await employeeRegistrationRepositry.findOneBy({
      employeeId: payload.employeeId,
    });

    delete payload.companyId;

    if (existingDetails) {
      let isEmployeeImageUpdated: Boolean = false;
      if (payload.employeeImage != existingDetails.employeeImage) {
        isEmployeeImageUpdated = true;
      }
      let updatedFields = await getChangedProperty(
        [payload],
        [existingDetails]
      );
      if (isEmployeeImageUpdated) {
        updatedFields = updatedFields + " " + "Employee Image";
      }
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
        .then(async () => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Employee Details For "${payload.employeeName}" Updated - Changes :  ${updatedFields} Updated By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Employee Details Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Employee Details ${payload.employeeName} - ${error.message} By User - `,
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
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Employee Details ${payload.employeeName} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Employee Details Added successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Employee Details ${payload.employeeName} - ${error.message} By User - `,
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

export const getEmployeeDetails = async (req: Request, res: Response) => {
  try {
    const employeeRegistrationRepositry =
      appSource.getRepository(employeeRegistration);
    const employee = await employeeRegistrationRepositry
      .createQueryBuilder("")
      .getMany();
    res.status(200).send({
      Result: employee,
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

export const updateEmployeeStatus = async (req: Request, res: Response) => {
  const employeeStatus: EmployeeDetailsStatus = req.body;
  const employeeRegistrationRepositry =
    appSource.getRepository(employeeRegistration);
  const emlpoyeeFound = await employeeRegistrationRepositry.findOneBy({
    employeeId: employeeStatus.employeeId,
  });
  try {
    if (!emlpoyeeFound) {
      throw new ValidationException("Company Not Found");
    }
    await employeeRegistrationRepositry
      .createQueryBuilder()
      .update(employeeRegistration)
      .set({ status: employeeStatus.status })
      .where({ employeeId: employeeStatus.employeeId })
      .execute();
    const logsPayload: logsDto = {
      userId: employeeStatus.userId,
      userName: null,
      statusCode: "200",
      message: `Employee Status For ${emlpoyeeFound.employeeName} Changed To ${employeeStatus.status} By User - `,
      companyId: employeeStatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status For ${emlpoyeeFound.employeeName} Changed Successfully`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: employeeStatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Employee Status For ${emlpoyeeFound.employeeName} to ${employeeStatus.status} - ${error.message} By User - `,
      companyId: employeeStatus.companyId,
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

export const deleteEmployee = async (req: Request, res: Response) => {
  const { employeeId, userId, companyId } = req.params;
  const employeeRegistrationRepositry =
    appSource.getTreeRepository(employeeRegistration);
  const employeeFound = await employeeRegistrationRepositry.findOneBy({
    employeeId: employeeId,
  });
  try {
    if (!employeeFound) {
      throw new ValidationException("Employee Not Found ");
    }
    await employeeRegistrationRepositry
      .createQueryBuilder()
      .delete()
      .from(employeeRegistration)
      .where({ employeeId: employeeId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Employee Details : ${employeeFound.employeeName} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${employeeFound.employeeName} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Employee Details : ${employeeFound.employeeName} - ${error.message} By User - `,
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
