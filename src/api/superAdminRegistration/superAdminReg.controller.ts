import { Router } from "express";
import { addSuperAdminRegistration, resetSuperAdminPassword, sendOtpResetSuperAdmin, sendOtpSuperAdmin, verifyOtpResetSuperAdmin, verifyOtpSuperAdmin } from "./superAdminReg.service";

const superAdminRegistrationRouter = Router();

superAdminRegistrationRouter.post('/addSuperAdmin' , (req , res) => addSuperAdminRegistration(req , res));

superAdminRegistrationRouter.get('/sendOtpSuperAdmin/:userId/:userName/:Email/:Mobile' ,(req,res)=>sendOtpSuperAdmin(req , res));

superAdminRegistrationRouter.get('/verifyOtpSuperAdmin/:userId/:otp', (req, res) => verifyOtpSuperAdmin(req, res) );

superAdminRegistrationRouter.get('/sendOtpResetSuperAdmin/:Email' ,(req,res)=>sendOtpResetSuperAdmin(req , res));

superAdminRegistrationRouter.get('/verifyOtpResetSuperAdmin/:userId/:otp', (req, res) => verifyOtpResetSuperAdmin(req, res) );

superAdminRegistrationRouter.post('/resetSuperAdminPassword' , (req , res) => resetSuperAdminPassword(req , res));

export default superAdminRegistrationRouter