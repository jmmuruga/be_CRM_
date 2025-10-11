import { Router } from "express";
import { addSuperAdminRegistration, sendOtpResetSuperAdmin, sendOtpSuperAdmin, verifyOtpSuperAdmin } from "./superAdminReg.service";

const superAdminRegistrationRouter = Router();

superAdminRegistrationRouter.post('/addSuperAdmin' , (req , res) => addSuperAdminRegistration(req , res));

superAdminRegistrationRouter.get('/sendOtpSuperAdmin/:userId/:userName/:Email/:Mobile' ,(req,res)=>sendOtpSuperAdmin(req , res));

superAdminRegistrationRouter.get('/verifyOtpSuperAdmin/:userId/:otp', (req, res) => verifyOtpSuperAdmin(req, res) );

superAdminRegistrationRouter.get('/sendOtpResetSuperAdmin/:Email' ,(req,res)=>sendOtpResetSuperAdmin(req , res));


export default superAdminRegistrationRouter