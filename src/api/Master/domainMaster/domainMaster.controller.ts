import { Router } from "express";
import { addUpdateDomainMaster, deleteDomainMaster, getDomainMasterDetails, getDomainMasterId, updateStatus } from "./domainMaster.service";
import { auth } from "../../../shared/helper";

const domainMasterRouter = Router();

domainMasterRouter.get('/getDomainMasterId/:companyId',auth , (req,res) => getDomainMasterId(req,res));

domainMasterRouter.post('/addUpdateDomainMaster', auth , (req,res) => addUpdateDomainMaster(req,res));

domainMasterRouter.get('/getDomainMasterDetails/:companyId', auth , (req,res) => getDomainMasterDetails(req,res));

domainMasterRouter.post('/updateDomainMasterStatus', auth ,(req,res)=>updateStatus(req,res));

domainMasterRouter.delete('/deleteDomainMaster/:domainMasterId/:userId/:companyId', auth ,(req,res)=>deleteDomainMaster(req,res));


export default domainMasterRouter;