import { Router } from "express";
import { addUpdateBackupSetting, getBacupSettingDetails, getDbBackup, updateShowBackupStatus, verifyDatabaseBackup } from "./backup.service";

const backupSettingRouter = Router();

backupSettingRouter.post('/addUpdateBackupSetting' , (req , res) => addUpdateBackupSetting(req , res));

backupSettingRouter.get('/getBackupSettingDetails' , (req , res) => getBacupSettingDetails(req , res));

backupSettingRouter.post('/updateShowBackupStatus', (req, res) => updateShowBackupStatus(req, res));

backupSettingRouter.get('/getDbBackup/:type/:userId/:companyId/:date',(req, res) => getDbBackup(req, res));

backupSettingRouter.get('/verifyDatabaseBackup/:date/:type',(req, res) => verifyDatabaseBackup(req, res));


export default backupSettingRouter;