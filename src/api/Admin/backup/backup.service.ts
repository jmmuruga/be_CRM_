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
import {
  getChangedProperty,
  getFullMonthYearAndDate,
} from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import sql from "mssql";
import dotenv from "dotenv";
import fs from "fs";
import { date } from "joi";
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
  let dbName = process.env.DB_NAME;
  const { type, userId, companyId, date } = req.params;
  // const { date } = req.query;
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
  const backupRepo = appSource.getRepository(backupHistory);

  let backupType = "";

  switch (type) {
    case "0":
      backupType = ""; // Just "Backup Taken Successfully"
      break;
    case "1":
      backupType = "Daily";
      break;
    case "2":
      backupType = "Weekly";
      break;
    case "3":
      backupType = "Monthly";
      break;
    default:
      backupType = "";
      break;
  }
  try {
    const backup = await sql.connect(sqlConfig);
    const driveResult = await backup.request().query(`
            SELECT backupDrive FROM [${process.env.DB_NAME}].[dbo].[backup_setting]
        `);
    let drive = driveResult.recordset[0].backupDrive;
    const backupFolderPath = `${drive}:\\DATABASE_BACKUP\\`;
    // Check if drive and folder exist
    if (!fs.existsSync(`${drive}:\\`)) {
      throw new ValidationException(`${drive} Drive not found on server.`);
    }
    if (!fs.existsSync(backupFolderPath)) {
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
    const result = await backup.request().query(query);
    await sql.close();

    const actualBackupDate =
      typeof date === "string" ? date : new Date().toISOString().split("T")[0];

    // const currentDateTime = new Date().toISOString();

    const backupRecord = backupRepo.create({
      actualBackupDate: actualBackupDate,
      type: type,
      backupDone: true,
      userId: userId, 
    });
    await backupRepo.save(backupRecord);

    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `${backupType} Backup Taken Successfully By User -`,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "DataBase BackUp Taken Succesfully !",
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Error While Taking ${backupType} Backup By User -`,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error.message);
  }
};

export const verifyDatabaseBackup = async (req: Request, res: Response) => {
  try {
    let { date, type } = req.params;
    let selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const convertedDate = getFullMonthYearAndDate(selectedDate.toString());
    const backupDetailsRepoistry = appSource.getRepository(backupHistory);
    let details: backupHistoryDto[];
    if (type == "3") {
      let month = new Date(date).getMonth() + 1;
      details = await backupDetailsRepoistry.query(
        `SELECT *
                 FROM [${process.env.DB_NAME}].[dbo].[backup_history] db
                 WHERE db.type = '${type}'AND MONTH(db.actualBackupDate) = ${month}`
      );
    } else {
      details = await backupDetailsRepoistry.query(
        `SELECT * FROM [${process.env.DB_NAME}].[dbo].[backup_history] db WHERE db.type = '${type}'AND 
        CONVERT(VARCHAR(10),  db.actualBackupDate, 120) = CONVERT(VARCHAR(10), '${convertedDate}', 120)`
      );
    }
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
