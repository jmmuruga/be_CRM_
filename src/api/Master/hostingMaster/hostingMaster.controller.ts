import { Router } from "express";
import { addUpdateHostingMaster, deleteHostingMasterDetails, getHostingId, getHostingMasterDetails, updateStatus } from "./hostingMaster.service";
import { auth } from "../../../shared/helper";

const hostingMasterRouter = Router();

hostingMasterRouter.get('/getHostingId/:companyId', auth ,(req,res) => getHostingId(req,res));

hostingMasterRouter.post('/addUpdateHostingMaster' , auth , (req , res) => addUpdateHostingMaster(req , res));

hostingMasterRouter.get('/getHostingMasterDetails/:companyId' , auth , (req , res) => getHostingMasterDetails(req , res));

hostingMasterRouter.post('/updateHostStatus', auth , (req,res) =>updateStatus(req,res));

hostingMasterRouter.delete('/deleteHostingMasterDetails/:hostingId/:userId/:companyId', auth ,(req, res) => deleteHostingMasterDetails(req, res));


export default hostingMasterRouter