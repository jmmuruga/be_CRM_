import { Router } from "express";
import { addUpdateDomainMaster, deleteDomainMaster, getDomainMasterDetails, getDomainMasterId, updateStatus } from "./domainMaster.service";

const domainMasterRouter = Router();

domainMasterRouter.get('/getDomainMasterId/:companyId' , (req,res) => getDomainMasterId(req,res));

domainMasterRouter.post('/addUpdateDomainMaster' , (req,res) => addUpdateDomainMaster(req,res));

domainMasterRouter.get('/getDomainMasterDetails/:companyId' , (req,res) => getDomainMasterDetails(req,res));

domainMasterRouter.post('/updateDomainMasterStatus' ,(req,res)=>updateStatus(req,res));

domainMasterRouter.delete('/deleteDomainMaster/:domainMasterId/:companyId' ,(req,res)=>deleteDomainMaster(req,res));


export default domainMasterRouter