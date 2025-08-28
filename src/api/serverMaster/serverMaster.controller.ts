import { Router } from "express";
import { addUpdateServerMaster, deleteServerMaster, getServerMasterDetails, getServerMasterId, updateStatus } from "./serverMaster.service";

const serverMasterRouter = Router();

serverMasterRouter.get('/getServerMasterId/:companyId' , (req,res) => getServerMasterId(req,res));

serverMasterRouter.post('/addUpdateServerMaster' , (req,res) => addUpdateServerMaster(req,res));

serverMasterRouter.get('/getServerMasterDetails/:companyId' , (req , res ) => getServerMasterDetails(req,res))

serverMasterRouter.post('/updateServerMasterStatus' ,(req,res)=>updateStatus(req,res));

serverMasterRouter.delete('/deleteServerMaster/:serverPlanId/:companyId',(req, res) => deleteServerMaster(req, res));


export default serverMasterRouter