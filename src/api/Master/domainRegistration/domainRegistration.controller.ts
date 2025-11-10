import { Router } from "express";
import { addUpdateDomainRegistration, deleteDomainRegistrationDetails, getDomainNameId, getDomainRegistrationDetails, updateStatus } from "./domainRegistration.service";
import { auth } from "../../../shared/helper";

const domainRegistrationRouter = Router();

domainRegistrationRouter.get('/getDomainNameId/:companyId', auth , (req,res) => getDomainNameId(req,res));

domainRegistrationRouter.post('/addUpdateDomainRegistration', auth , (req , res) => addUpdateDomainRegistration(req , res));

domainRegistrationRouter.get('/getDomainRegistrationDetails/:companyId', auth , (req , res) => getDomainRegistrationDetails(req , res));

domainRegistrationRouter.post('/updateDomainRegistrationStatus', auth , (req,res) =>updateStatus(req,res));

domainRegistrationRouter.delete('/deleteDomainRegistrationDetails/:domainNameId/:userId/:companyId', auth ,(req, res) => deleteDomainRegistrationDetails(req, res));

export default domainRegistrationRouter