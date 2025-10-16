import { Router } from "express";
import { addUpdatePinSetting, getPinSettingDetails, sendOtpPinSetting, verifyOtpPinSetting } from "./pinSeting.service";

const pinSettingRouter = Router();

pinSettingRouter.post('/addUpdatePin' , (req , res) => addUpdatePinSetting(req , res));

pinSettingRouter.get('/getPinSettingDetails' , (req , res) => getPinSettingDetails(req , res));

pinSettingRouter.get('/sendOtpPinSetting/:Email', (req, res) => sendOtpPinSetting(req, res))

pinSettingRouter.get('/verifyOtpPinSetting/:userId/:otp', (req, res) => verifyOtpPinSetting(req, res))

export default pinSettingRouter