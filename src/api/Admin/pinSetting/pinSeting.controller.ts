import { Router } from "express";
import { addUpdatePinSetting, getPinSettingDetails, sendOtpPinSetting, sendOtpPinSettingCompany, verifyAddPin, verifyDeletePin, verifyEditPin, verifyOtpPinSetting } from "./pinSeting.service";
import { auth } from "../../../shared/helper";

const pinSettingRouter = Router();

pinSettingRouter.post('/addUpdatePin' , auth , (req , res) => addUpdatePinSetting(req , res));

pinSettingRouter.get('/getPinSettingDetails' , auth , (req , res) => getPinSettingDetails(req , res));

pinSettingRouter.get('/sendOtpPinSetting/:userId', auth , (req, res) => sendOtpPinSetting(req, res));

pinSettingRouter.get('/verifyOtpPinSetting/:userId/:otp', auth , (req, res) => verifyOtpPinSetting(req, res))

pinSettingRouter.get('/sendOtpPinSettingCompany/:userId', auth , (req, res) => sendOtpPinSettingCompany(req, res))

pinSettingRouter.get('/verifyDeletePin/:companyId/:userId/:deletePin', auth , (req, res) => verifyDeletePin(req, res))

pinSettingRouter.get('/verifyEditPin/:editPin', auth , (req, res) => verifyEditPin(req, res))

pinSettingRouter.get('/verifyAddPin/:addPin', auth , (req, res) => verifyAddPin(req, res))


export default pinSettingRouter