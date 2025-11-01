import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import {
  backupHistoryDto,
  backupSettingDto,
  backupSettingValidation,
  updateBackupStatus,
} from "./backup.dto";
import { Request, Response } from "express";
import { backupHistory, backupSetting } from "./backup.model";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import sql from "mssql";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

export const addUpdateBackupSetting = async (req: Request, res: Response) => {
  const payload: backupSettingDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

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
    delete payload.companyId;

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
            message: `Backup Setting Details Updated - Changes : ${updatedFields}By User - `,
            companyId: companyId,
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
            message: `Error While Updating Backup Setting Details - ${error.message} By User - `,
            companyId: companyId,
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
        message: `Backup Setting Details Added By User - `,
        companyId: companyId,
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
      message: `Error While Adding Backup Setting Details ${error.message} By User - `,
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

export const updateShowBackupStatus = async (req: Request, res: Response) => {
  const backupstatus: updateBackupStatus = req.body;
  const backupRepositry = appSource.getRepository(backupSetting);
  const backupFound = await backupRepositry.findOneBy({
    backupId: backupstatus.backupId,
  });
  try {
    if (!backupFound) {
      throw new ValidationException("Backup Not Found");
    }
    await backupRepositry
      .createQueryBuilder()
      .update(backupSetting)
      .set({ showBackup: backupstatus.status })
      // .where({ backupId: backupstatus.backupId })
      .execute();
    const logsPayload: logsDto = {
      userId: backupstatus.userId,
      userName: null,
      statusCode: "200",
      message: `Backup Status For ${backupFound.backupDrive} Changed To ${backupstatus.status} By User - `,
      companyId: backupstatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for ${backupFound.backupDrive} Changed Successfully`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: backupstatus.userId,
      userName: null,
      statusCode: "400",
      message: `Error While Changing Backup Status For ${backupFound.backupDrive} to ${backupstatus.status} - ${error.message} By User - `,
      companyId: backupstatus.companyId,
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

export const getDbBackup = async (req: Request, res: Response) => {
  const { userId, companyId, backupType } = req.params;
  let dbName = process.env.DB_NAME;

  const sqlConfig = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER_HOST,
    database: process.env.DB_NAME,
    options: {
      encrypt: false, // Disable encryption
      trustServerCertificate: true, // Depending on your SQL Server settings
    },
    requestTimeout: 1200000,
  };

  let successMessageType = "";
  let errorMessageType = "";

  switch (parseInt(backupType)) {
    case 0:
      successMessageType = "Database Backed Up Successful By User - ";
      errorMessageType = "Error While Taking Database Backup By User - ";
      break;
    case 1:
      successMessageType = "Daily Database Backed Up Successful By User - ";
      errorMessageType = "Error While Taking Daily Database Backup By User - ";
      break;
    case 2:
      successMessageType = "Weekly Database Backed Up Successful By User - ";
      errorMessageType = "Error While Taking Weekly Database Backup By User - ";
      break;
    case 3:
      successMessageType = "Monthly Database Backed Up Successful By User - ";
      errorMessageType =
        "Error While Taking Monthly Database Backup By User - ";
      break;
    default:
      successMessageType = "Database Backed Up Successful By User - ";
      errorMessageType = "Error While Taking Database Backup By User - ";
  }

  try {
    const backup = await sql.connect(sqlConfig);

    const driveResult = await backup.request().query(`
            SELECT backupDrive FROM [${process.env.DB_NAME}].[dbo].[backup_setting]
        `);
    let drive = driveResult.recordset[0].backupDrive;

    const folderPath = `${drive}:\\DATABASE_BACKUP\\`;

    if (!fs.existsSync(`${drive}:\\`)) {
      throw new ValidationException(`${drive} Drive not found on server.`);
    }
    if (!fs.existsSync(folderPath)) {
      throw new ValidationException(
        `No folder found in drive: ${drive}. Please create a folder to take back up`
      );
    }
    // Your SQL query
    const query: string = `
        DECLARE @path VARCHAR(256) -- path of backup files
        DECLARE @fileName VARCHAR(256) -- filename for backup
        DECLARE @fileDate VARCHAR(20) -- used for file name
        DECLARE @time datetime
        SET @time = GETDATE() -- No need for explicit conversion here
        SET @path = '${drive}:\\DATABASE_BACKUP\\'
        -- specify filename format
        SET @fileDate = REPLACE(CONVERT(VARCHAR(20), @time, 120), ':', '') -- Format the date without colons
            BEGIN
                SET @fileName = @path + '${dbName}' + '_' + @fileDate + '.BAK'
                BACKUP DATABASE [${process.env.DB_NAME}] TO DISK = @fileName
            END
  `;
    // Execute the query

    // 🔹 Get backup setting repository
    const backupSettingRepo = appSource.getRepository(backupSetting);
    const setting = await backupSettingRepo.findOne({ where: {} });

    // 🔹 Formatter function
    function getFormattedLocalDateTime(date: Date = new Date()): string {
      const pad = (n: number, width = 2) => n.toString().padStart(width, "0");
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      const millis = pad(date.getMilliseconds(), 3).padEnd(7, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${millis}`;
    }

    const formattedDate = getFormattedLocalDateTime();
    let formattedBackupDate = formattedDate;

    if (setting?.dailyTime) {
      const timeParts = setting.dailyTime.split(":").map(Number);

      if (timeParts.length >= 2 && !timeParts.some(isNaN)) {
        const [hh, mm, ss = 0] = timeParts;

        const backupDateObj = new Date();
        backupDateObj.setHours(hh, mm, ss, 0);

        formattedBackupDate = getFormattedLocalDateTime(backupDateObj);
      } else {
      }
    }

    const backupRepo = appSource.getRepository(backupHistory);
    const backupRecord = backupRepo.create({
      userId: userId,
      type: backupType.toString(),
      date: formattedDate,
      backupDate: formattedBackupDate,
    });
    // Save to DB

    await backupRepo.save(backupRecord);

    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: successMessageType,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: `Database Backup Taken Successfully !`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `${errorMessageType} - ${error.message}`,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(errorMessageType);
  }
};
