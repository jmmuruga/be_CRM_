import { Router } from "express";
import { addUpdateBackupSetting, getBacupSettingDetails, getDbBackup, updateShowBackupStatus, verifyDatabaseBackup } from "./backup.service";
import { auth } from "../../../shared/helper";

const backupSettingRouter = Router();

backupSettingRouter.post('/addUpdateBackupSetting' , auth , (req , res) => addUpdateBackupSetting(req , res));

backupSettingRouter.get('/getBackupSettingDetails' , auth , (req , res) => getBacupSettingDetails(req , res));

backupSettingRouter.post('/updateShowBackupStatus', auth ,(req, res) => updateShowBackupStatus(req, res));

backupSettingRouter.get('/getDbBackup/:type/:userId/:companyId/:date', auth ,(req, res) => getDbBackup(req, res));

backupSettingRouter.get('/verifyDatabaseBackup/:date/:type', auth ,(req, res) => verifyDatabaseBackup(req, res));


export default backupSettingRouter;