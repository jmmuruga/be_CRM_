import { Router } from "express";
import { addUpdateDomainRegistration, deleteDomainRegistrationDetails, getDomainNameId, getDomainRegistrationDetails, updateStatus } from "./domainRegistration.service";

const domainRegistrationRouter = Router();

domainRegistrationRouter.get('/getDomainNameId/:companyId' , (req,res) => getDomainNameId(req,res));

domainRegistrationRouter.post('/addUpdateDomainRegistration' , (req , res) => addUpdateDomainRegistration(req , res));

domainRegistrationRouter.get('/getDomainRegistrationDetails/:companyId' , (req , res) => getDomainRegistrationDetails(req , res));

domainRegistrationRouter.post('/upateDomainRegistrationStatus', (req,res) =>updateStatus(req,res));

domainRegistrationRouter.delete('/deleteDomainRegistrationDetails/:domainNameId/:companyId',(req, res) => deleteDomainRegistrationDetails(req, res));


export default domainRegistrationRouter