import { Router } from "express";
import { addUpdatePinSetting } from "./pinSeting.service";

const pinSettingRouter = Router();

pinSettingRouter.post('/addUpdatePin' , (req , res) => addUpdatePinSetting(req , res));


export default pinSettingRouter