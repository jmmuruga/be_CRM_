import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { BankAccountCreation } from "./bankAccCreation.model";
import { ValidationException } from "../../../core/exception";
import {
  bankAccountCreationDto,
  bankAccountCreationStatus,
  bankAccountCreationValidation,
} from "./bankAccCreation.dto";
import { getChangedProperty } from "../../../shared/helper";
import { Not } from "typeorm";
import { logsDto } from "../../Admin/logs/logs.dto";
import { InsertLog } from "../../Admin/logs/logs.service";
import { BankMaster } from "../Bank Master/bankMaster.model";
import { PaymentType } from "../Payment Type/paymentType.model";

export const getBankAccountCreationId = async (req: Request, res: Response) => {
  try {
    const companyid = req.params.companyId;
    const bankAccountCreationRepository =
      appSource.getRepository(BankAccountCreation);
    let bankAccountCreationId = await bankAccountCreationRepository.query(
      `SELECT bankAccNumberCreationId
            FROM [${process.env.DB_NAME}].[dbo].[bank_account_creation] where companyId = ${companyid}
            Group by bankAccNumberCreationId
            ORDER BY CAST(bankAccNumberCreationId AS INT) DESC;`
    );

    let id = "0";
    if (bankAccountCreationId?.length > 0) {
      id = bankAccountCreationId[0].bankAccNumberCreationId;
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

export const addUpdateBankAccCreation = async (req: Request, res: Response) => {
  const payload: bankAccountCreationDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  try {
    const validation = bankAccountCreationValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const bankAccountCreationRepository =
      appSource.getRepository(BankAccountCreation);
    const existingDetails = await bankAccountCreationRepository.findOneBy({
      bankAccNumberCreationId: payload.bankAccNumberCreationId,
      companyId: payload.companyId,
    });

    if (existingDetails) {
      let updatedFields = await getChangedProperty(
        [payload],
        [existingDetails]
      );

      const bankAccountNumberValidation =
        await bankAccountCreationRepository.findOneBy({
          bankAccountNumber: payload.bankAccountNumber,
          bankAccNumberCreationId: Not(payload.bankAccNumberCreationId),
          companyId: payload.companyId,
        });
      if (bankAccountNumberValidation) {
        throw new ValidationException("Bank Account Number Already Exist");
      }

      const registeredMobileValidation =
        await bankAccountCreationRepository.findOneBy({
          registeredMobileNumber: payload.registeredMobileNumber,
          bankAccNumberCreationId: Not(payload.bankAccNumberCreationId),
          companyId: payload.companyId,
        });
      if (registeredMobileValidation) {
        throw new ValidationException("Registered Mobile Number Already Exist");
      }

      await bankAccountCreationRepository
        .update(
          { bankAccNumberCreationId: payload.bankAccNumberCreationId ,companyId: payload.companyId },
          payload
        )
        .then(async () => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Bank Account Creation Details For "${payload.accountHolderName}" Updated Successfully - Changes : ${updatedFields}`,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Bank Account Details Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Bank Account  Details "${payload.accountHolderName}" - ${error.message} By User - `,
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
      const bankAccountNumberValidation =
        await bankAccountCreationRepository.findOneBy({
          bankAccountNumber: payload.bankAccountNumber,
          companyId:payload.companyId
        });
      if (bankAccountNumberValidation) {
        throw new ValidationException("Bank Account Number Already Exist");
      }
      const registeredMobileValidation =
        await bankAccountCreationRepository.findOneBy({
          registeredMobileNumber: payload.registeredMobileNumber,
          companyId:payload.companyId
        });
      if (registeredMobileValidation) {
        throw new ValidationException("Registered Mobile Number Already Exist");
      }

      await bankAccountCreationRepository.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Bank Account Creation Details For "${payload.accountHolderName}" Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Bank Account Details Added successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Bank Account Details For "${payload.accountHolderName}" - ${error.message} By User - `,
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

export const getBankAccountCreationDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const companyId = req.params.companyId;
    const bankAccCreationRepositry =
      appSource.getRepository(BankAccountCreation);
    const bankAccCreationDetails = await bankAccCreationRepositry
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();

    const bankMasterRepositry = appSource.getRepository(BankMaster);
    const bankMasterDetails = await bankMasterRepositry
      .createQueryBuilder()
      .where({ companyId: companyId })
      .getMany();

    bankAccCreationDetails.forEach((x) => {
      x["bank"] = bankMasterDetails.find(
        (y) => +y.bankNameId == +x.Bank
      ).bankFullName;
    });

    res.status(200).send({
      Result: bankAccCreationDetails,
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

export const updateBankAccountCreationStatus = async (
  req: Request,
  res: Response
) => {
  const bankaccountstatus: bankAccountCreationStatus = req.body;
  const bankAccCreationRepositry = appSource.getRepository(BankAccountCreation);
  const bankAccCreationFound = await bankAccCreationRepositry.findOneBy({
    bankAccNumberCreationId: bankaccountstatus.bankAccNumberCreationId,
    companyId: bankaccountstatus.companyId,
  });
  try {
    if (!bankAccCreationFound) {
      throw new ValidationException("Company Not Found");
    }
    await bankAccCreationRepositry
      .createQueryBuilder()
      .update(BankAccountCreation)
      .set({ status: bankaccountstatus.status })
      .where({bankAccNumberCreationId: bankaccountstatus.bankAccNumberCreationId,})
      .andWhere({ companyId: bankaccountstatus.companyId })
      .execute();

    const logsPayload: logsDto = {
      userId: bankaccountstatus.userId,
      userName: null,
      statusCode: "200",
      message: ` Status For Account Holder - ${bankAccCreationFound.accountHolderName} Changed To ${bankaccountstatus.status} By User - `,
      companyId: bankaccountstatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Changed Successfully For Account Holder - ${bankAccCreationFound.accountHolderName} `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: bankaccountstatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Bank Account Creation Status For Account Holder - ${bankAccCreationFound.accountHolderName} to ${bankaccountstatus.status} - ${error.message} By User - `,
      companyId: bankaccountstatus.companyId,
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

export const deleteBankAccCreation = async (req: Request, res: Response) => {
  const { companyId, userId, bankAccNumberCreationId } = req.params;
  const bankAccCreationRepositry =
    appSource.getTreeRepository(BankAccountCreation);
  const bankAccCreationFound = await bankAccCreationRepositry.findOneBy({
    bankAccNumberCreationId: bankAccNumberCreationId,
    companyId: companyId,
  });
  try {
    if (!bankAccCreationFound) {
      throw new ValidationException("Bank Account Creation Not Found ");
    }

    const paymentTypeRepositry = appSource.getRepository(PaymentType);
    const paymentExist = await paymentTypeRepositry.findBy({
      linkedAccountNumber: bankAccNumberCreationId,
    });
    if (paymentExist?.length > 0) {
      throw new ValidationException(
        "Unable To Delete , Bank Account Creation Details Exist In Payment Type !"
      );
    }

    await bankAccCreationRepositry
      .createQueryBuilder()
      .delete()
      .from(BankAccountCreation)
      .where({ bankAccNumberCreationId: bankAccNumberCreationId })
      .andWhere({ companyId: companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: ` Bank Account Details : "${bankAccCreationFound.accountHolderName}" From ${bankAccCreationFound.Bank} - ${bankAccCreationFound.Branch} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Bank Account Details For "${bankAccCreationFound.accountHolderName}" Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Bank Account Details : "${bankAccCreationFound.accountHolderName}" From ${bankAccCreationFound.Bank} - ${bankAccCreationFound.Branch} - ${error.message} By User - `,
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
