import { Router } from "express";
import { addUpdateDomainMaster, getServiceProviderId } from "./domainMaster.service";

const domainMasterRouter = Router();

domainMasterRouter.get('/getServiceProviderId' , (req,res) => getServiceProviderId(req,res));

domainMasterRouter.post('/addUpdateDomainMaster' , (req , res) => addUpdateDomainMaster(req , res));


export default domainMasterRouter