import { Router } from "express";
import { addSuperAdminRegistration, resetSuperAdminPassword, sendOtpResetSuperAdmin, sendOtpSuperAdmin, verifyOtpResetSuperAdmin, verifyOtpSuperAdmin } from "./superAdminReg.service";
import { auth } from "../../shared/helper";

const superAdminRegistrationRouter = Router();

superAdminRegistrationRouter.post('/addSuperAdmin' , auth , (req , res) => addSuperAdminRegistration(req , res));

superAdminRegistrationRouter.get('/sendOtpSuperAdmin/:userId/:userName/:Email/:Mobile' , auth , (req,res)=>sendOtpSuperAdmin(req , res));

superAdminRegistrationRouter.get('/verifyOtpSuperAdmin/:userId/:otp', auth , (req, res) => verifyOtpSuperAdmin(req, res) );

superAdminRegistrationRouter.get('/sendOtpResetSuperAdmin/:Email' , auth , (req,res)=>sendOtpResetSuperAdmin(req , res));

superAdminRegistrationRouter.get('/verifyOtpResetSuperAdmin/:userId/:otp', auth , (req, res) => verifyOtpResetSuperAdmin(req, res) );

superAdminRegistrationRouter.post('/resetSuperAdminPassword' , auth , (req , res) => resetSuperAdminPassword(req , res));

export default superAdminRegistrationRouter