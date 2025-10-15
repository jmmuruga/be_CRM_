import { Router } from "express";
import { addUpdatePinSetting, getPinSettingDetails } from "./pinSeting.service";

const pinSettingRouter = Router();

pinSettingRouter.post('/addUpdatePin' , (req , res) => addUpdatePinSetting(req , res));

pinSettingRouter.get('/getPinSettingDetails/:companyId' , (req , res) => getPinSettingDetails(req , res));

export default pinSettingRouter