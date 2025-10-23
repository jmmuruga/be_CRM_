import { Router } from "express";
import { addUpdatePinSetting, getPinSettingDetails, sendOtpPinSetting, sendOtpPinSettingCompany, verifyDeletePin, verifyEditPin, verifyOtpPinSetting } from "./pinSeting.service";

const pinSettingRouter = Router();

pinSettingRouter.post('/addUpdatePin' , (req , res) => addUpdatePinSetting(req , res));

pinSettingRouter.get('/getPinSettingDetails' , (req , res) => getPinSettingDetails(req , res));

pinSettingRouter.get('/sendOtpPinSetting', (req, res) => sendOtpPinSetting(req, res))

pinSettingRouter.get('/verifyOtpPinSetting/:userId/:otp', (req, res) => verifyOtpPinSetting(req, res))

pinSettingRouter.get('/sendOtpPinSettingCompany', (req, res) => sendOtpPinSettingCompany(req, res))

pinSettingRouter.get('/verifyDeletePin/:deletePin', (req, res) => verifyDeletePin(req, res))

pinSettingRouter.get('/verifyEditPin/:editPin', (req, res) => verifyEditPin(req, res))


export default pinSettingRouter