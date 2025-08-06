import { Router } from "express";
import { addUpdateDomainRegistration, getDomainNameId } from "./domainRegistration.service";

const domainRegistrationRouter = Router();

domainRegistrationRouter.get('/getDomainNameId' , (req,res) => getDomainNameId(req,res));

domainRegistrationRouter.post('/addUpdateDomainRegistration' , (req , res) => addUpdateDomainRegistration(req , res));



export default domainRegistrationRouter