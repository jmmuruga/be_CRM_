import { Router } from "express";
import { addUpdateBackupSetting, getBacupSettingDetails, getDbBackup, updateShowBackupStatus } from "./backup.service";

const backupSettingRouter = Router();

backupSettingRouter.post('/addUpdateBackupSetting' , (req , res) => addUpdateBackupSetting(req , res));

backupSettingRouter.get('/getBackupSettingDetails' , (req , res) => getBacupSettingDetails(req , res));

backupSettingRouter.post('/updateShowBackupStatus', (req, res) => updateShowBackupStatus(req, res));

backupSettingRouter.get('/getDbBackup/:companyId/:userId/:backupType/:date/:backupDate',(req, res) => getDbBackup(req, res));


export default backupSettingRouter;