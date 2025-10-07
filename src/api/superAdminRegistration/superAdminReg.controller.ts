import { Router } from "express";
import { addSuperAdminRegistration } from "./superAdminReg.service";

const superAdminRegistrationRouter = Router();

superAdminRegistrationRouter.post('/addSuperAdmin' , (req , res) => addSuperAdminRegistration(req , res));

export default superAdminRegistrationRouter