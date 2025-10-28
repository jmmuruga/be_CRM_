import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import {  backupSettingDto, backupSettingValidation } from "./backup.dto";
import { Request, Response } from "express";
import { backupSetting } from "./backup.model";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addUpdateBackupSetting = async (req: Request, res: Response) => {
  const payload: backupSettingDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  try {
     payload.backupId = payload.backupId?.toString();
    const validation = backupSettingValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const backupRepositry = appSource.getRepository(backupSetting);
    const existingDetails = await backupRepositry.findOneBy({
      backupId: payload.backupId,
    });

    if (existingDetails) {
      payload.editedBy_userId = payload.editedBy_userId || userId;
    }
    if (existingDetails) {
      await backupRepositry
        .update({ backupId: payload.backupId }, payload)
        .then(async () => {
            let updatedFields: string = await getChangedProperty(
                        [payload],
                        [existingDetails]
                      );
                      const logsPayload: logsDto = {
                        userId: userId,
                        userName: null,
                        statusCode: "200",
                        message: `Backup Setting Details For "${payload.backupDrive}" Updated - Changes : ${updatedFields}By User - `,
                        // companyId: companyId,
                      };
                      await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "Backup Setting Updated Successfully",
          });
        })
        .catch(async (error) => {
            const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Backup Setting Details ${payload.backupDrive} - ${error.message} By User - `,
            // companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(500).send(error.message);
        });
    } else {
      payload.createdBy_userId = userId;
      payload.editedBy_userId = null;
      await backupRepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Backup Setting Details For "${payload.backupDrive}" Added By User - `,
        // companyId: companyId,
      };
      await InsertLog(logsPayload);

      res.status(200).send({
        IsSuccess: " Backup Setting Saved Successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Backup Setting Details ${payload.backupDrive} - ${error.message} By User - `,
    //   companyId: companyId,
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


export const getBacupSettingDetails = async (req: Request, res: Response) => {
  try {
    const backupRepositry = appSource.getRepository(backupSetting);
    const details = await backupRepositry.createQueryBuilder("").getMany();
    res.status(200).send({
      Result: details,
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



