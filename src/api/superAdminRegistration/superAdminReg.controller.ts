import { Router } from "express";
import { addSuperAdminRegistration, sendOtpSuperAdmin, verifyOtpSuperAdmin } from "./superAdminReg.service";

const superAdminRegistrationRouter = Router();

superAdminRegistrationRouter.post('/addSuperAdmin' , (req , res) => addSuperAdminRegistration(req , res));

superAdminRegistrationRouter.get('/sendOtpSuperAdmin/:userId/:userName/:Email/:Mobile' ,(req,res)=>sendOtpSuperAdmin(req , res));

superAdminRegistrationRouter.get('/verifyOtpSuperAdmin/:userId/:otp', (req, res) => verifyOtpSuperAdmin(req, res) );


export default superAdminRegistrationRouter