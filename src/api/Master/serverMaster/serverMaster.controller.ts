import { Router } from "express";
import { addUpdateServerMaster, deleteServerMaster, getServerMasterDetails, getServerMasterId, updateStatus } from "./serverMaster.service";
import { auth } from "../../../shared/helper";

const serverMasterRouter = Router();

serverMasterRouter.get('/getServerMasterId/:companyId' , auth , (req,res) => getServerMasterId(req,res));

serverMasterRouter.post('/addUpdateServerMaster' , auth , (req,res) => addUpdateServerMaster(req,res));

serverMasterRouter.get('/getServerMasterDetails/:companyId' , auth , (req , res ) => getServerMasterDetails(req,res))

serverMasterRouter.post('/updateServerMasterStatus' , auth , (req,res)=>updateStatus(req,res));

serverMasterRouter.delete('/deleteServerMaster/:serverPlanId/:userId/:companyId', auth ,(req, res) => deleteServerMaster(req, res));


export default serverMasterRouter