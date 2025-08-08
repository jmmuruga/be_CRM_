import { Router } from "express";
import { addUpdateCompanyRegistration, getCompanyDetails, getCompanyId } from "./companyRegistration.service";

const companyRegistrationRouter = Router();

companyRegistrationRouter.get('/getcompanyId' , (req,res) => getCompanyId(req,res));

companyRegistrationRouter.post('/addUpdateCompanyRegistration' , (req , res) => addUpdateCompanyRegistration(req , res));

companyRegistrationRouter.get('/getCompanyDetails' , (req ,res) => getCompanyDetails(req , res));


export default companyRegistrationRouter