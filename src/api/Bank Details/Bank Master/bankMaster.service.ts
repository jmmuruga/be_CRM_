import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { BankMaster } from "./bankMaster.model";
import { ValidationException } from "../../../core/exception";
import {
  bankMasterDto,
  bankMasterStatus,
  bankMasterValidation,
} from "./bankMaster.dto";
import { Not } from "typeorm";
import { logsDto } from "../../Admin/logs/logs.dto";
import { getChangedProperty } from "../../../shared/helper";
import { InsertLog } from "../../Admin/logs/logs.service";

export const getBankNameId = async (req: Request, res: Response) => {
  try {
    const bankMasterRepositry = appSource.getRepository(BankMaster);
    let bankNameId = await bankMasterRepositry.query(
      `SELECT bankNameId
            FROM [${process.env.DB_NAME}].[dbo].[bank_master]
            Group by bankNameId
            ORDER BY CAST(bankNameId AS INT) DESC;`
    );

    let id = "0";
    if (bankNameId?.length > 0) {
      id = bankNameId[0].bankNameId;
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

export const addUpdateBankMaster = async (req: Request, res: Response) => {
  const payload: bankMasterDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  try {
    const validation = bankMasterValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const bankMasterRepository = appSource.getRepository(BankMaster);
    const existingDetails = await bankMasterRepository.findOneBy({
      bankNameId: payload.bankNameId,
    });

    if (existingDetails) {
      let updatedFields = await getChangedProperty(
        [payload],
        [existingDetails]
      );

      const branchPhoneValidation = await bankMasterRepository.findOneBy({
        branchPhone: payload.branchPhone,
        bankNameId: Not(payload.bankNameId),
      });
      if (branchPhoneValidation) {
        throw new ValidationException("Branch Phone Number Already Exist");
      }

      const branchManagerPhoneValidation = await bankMasterRepository.findOneBy(
        {
          branchManagerPhone: payload.branchManagerPhone,
          bankNameId: Not(payload.bankNameId),
        }
      );
      if (branchManagerPhoneValidation) {
        throw new ValidationException(
          "Branch Manager Phone Number Already Exist"
        );
      }

      const ifscCodeValidation = await bankMasterRepository.findOneBy({
        ifscCode: payload.ifscCode,
        bankNameId: Not(payload.bankNameId),
      });
      if (ifscCodeValidation) {
        throw new ValidationException(
          "IFSC Code Already Exist For Another Bank"
        );
      }

      const bankMasterValidation = await bankMasterRepository.findOneBy({
        bankFullName: payload.bankFullName,
        branchLocation: payload.branchLocation,
        bankNameId: Not(payload.bankNameId),
      });
      if (bankMasterValidation) {
        throw new ValidationException("Branch Already Exists For This Bank.");
      }

      await bankMasterRepository
        .update({ bankNameId: payload.bankNameId }, payload)
        .then(async () => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Bank Master Details For "${payload.bankFullName}" Updated Successfully - Changes : ${updatedFields}`,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Company Details Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Bank Master Details "${payload.bankFullName}" - ${error.message} By User - `,
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
      const branchPhoneValidation = await bankMasterRepository.findOneBy({
        branchPhone: payload.branchPhone,
      });
      if (branchPhoneValidation) {
        throw new ValidationException("Branch Phone Number Already Exist");
      }

      const branchManagerPhoneValidation = await bankMasterRepository.findOneBy(
        {
          branchManagerPhone: payload.branchManagerPhone,
        }
      );
      if (branchManagerPhoneValidation) {
        throw new ValidationException(
          "Branch Manager Phone Number Already Exist"
        );
      }

      const ifscCodeValidation = await bankMasterRepository.findOneBy({
        ifscCode: payload.ifscCode,
      });
      if (ifscCodeValidation) {
        throw new ValidationException(
          "IFSC Code Already Exist For Another Bank"
        );
      }

      const bankMasterValidation = await bankMasterRepository.findOneBy({
        bankFullName: payload.bankFullName,
        branchLocation: payload.branchLocation,
      });
      if (bankMasterValidation) {
        throw new ValidationException("Branch Already Exists For This Bank.");
      }
      await bankMasterRepository.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Bank Master Details For "${payload.bankFullName}" Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "Bank Master Details Added successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Bank Master Details For "${payload.bankFullName}" - ${error.message} By User - `,
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

export const getBankMasterDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const bankMasterRepository = appSource.getRepository(BankMaster);
    const bankMasterDetails = await bankMasterRepository
      .createQueryBuilder("")
      .where({ companyId: companyId })
      .getMany();
    res.status(200).send({
      Result: bankMasterDetails,
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

export const updateBankMasterStatus = async (req: Request, res: Response) => {
  const bankstatus: bankMasterStatus = req.body;
  const bankMasterRepositry = appSource.getRepository(BankMaster);
  const bankMasterFound = await bankMasterRepositry.findOneBy({
    bankNameId: bankstatus.bankNameId,
    companyId: bankstatus.companyId,
  });
  try {
    if (!bankMasterFound) {
      throw new ValidationException("Company Not Found");
    }
    await bankMasterRepositry
      .createQueryBuilder()
      .update(BankMaster)
      .set({ status: bankstatus.status })
      .where({ bankNameId: bankstatus.bankNameId })
      .andWhere({ companyId: bankstatus.companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: bankstatus.userId,
      userName: null,
      statusCode: "200",
      message: ` Status For ${bankMasterFound.bankFullName} - ${bankMasterFound.branchLocation} Changed To ${bankstatus.status} By User - `,
      companyId: bankstatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status Changed Successfully For ${bankMasterFound.bankFullName} - ${bankMasterFound.branchLocation} `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: bankstatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Bank Master Status For ${bankMasterFound.bankFullName} - ${bankMasterFound.branchLocation} to ${bankstatus.status} - ${error.message} By User - `,
      companyId: bankstatus.companyId,
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

export const deleteBankMaster = async (req: Request, res: Response) => {
  const { companyId, userId, bankNameId } = req.params;
  const bankMasterRepositry = appSource.getTreeRepository(BankMaster);
  const bankMasterFound = await bankMasterRepositry.findOneBy({
    bankNameId: bankNameId,
    companyId: companyId,
  });
  try {
    if (!bankMasterFound) {
      throw new ValidationException("Bank Master Not Found ");
    }

    await bankMasterRepositry
      .createQueryBuilder()
      .delete()
      .from(BankMaster)
      .where({ bankNameId: bankNameId })
      .andWhere({ companyId: companyId })
      .execute();
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: ` Bank Master Details : ${bankMasterFound.bankFullName} - ${bankMasterFound.branchLocation} Deleted By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${bankMasterFound.bankFullName} - ${bankMasterFound.branchLocation} Deleted Successfully `,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting Bank Master Details : ${bankMasterFound.bankFullName} - ${bankMasterFound.branchLocation} - ${error.message} By User - `,
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
