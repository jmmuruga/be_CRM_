import { Router } from "express";
import { addUpdateCompanyRegistration, getCompanyNameId } from "./companyRegistration.service";

const companyRegistrationRouter = Router();

companyRegistrationRouter.get('/getcompanyNameId' , (req,res) => getCompanyNameId(req,res));

companyRegistrationRouter.post('/addUpdateCompanyRegistration' , (req , res) => addUpdateCompanyRegistration(req , res));


export default companyRegistrationRouter