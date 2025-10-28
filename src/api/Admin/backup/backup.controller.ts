import { Router } from "express";
import { addUpdateBackupSetting, getBacupSettingDetails } from "./backup.service";

const backupSettingRouter = Router();

backupSettingRouter.post('/addUpdateBackupSetting' , (req , res) => addUpdateBackupSetting(req , res));

backupSettingRouter.get('/getBackupSettingDetails' , (req , res) => getBacupSettingDetails(req , res));


export default backupSettingRouter;