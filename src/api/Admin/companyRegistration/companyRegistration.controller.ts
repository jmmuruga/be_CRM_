import { Router } from "express";
import { addUpdateCompanyRegistration, deleteCompany, getCompanyDetails, getCompanyId, updateCompanyStatus } from "./companyRegistration.service";
import { auth } from "../../../shared/helper";

const companyRegistrationRouter = Router();

companyRegistrationRouter.get('/getcompanyId' , auth , (req,res) => getCompanyId(req,res));

companyRegistrationRouter.post('/addUpdateCompanyRegistration' , auth , (req , res) => addUpdateCompanyRegistration(req , res));

companyRegistrationRouter.get('/getCompanyDetails' , auth , (req ,res) => getCompanyDetails(req , res));

companyRegistrationRouter.post('/updateStatusForCompany' , auth , (req , res) => updateCompanyStatus(req ,res));

companyRegistrationRouter.delete('/deleteCompany/:userId/:companyId' , auth , (req , res) => deleteCompany(req ,res));


export default companyRegistrationRouter