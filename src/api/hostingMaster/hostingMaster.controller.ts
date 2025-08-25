import { Router } from "express";
import { addUpdateHostingMaster, deleteHostingMasterDetails, getHostingId, getHostingMasterDetails, updateStatus } from "./hostingMaster.service";

const hostingMasterRouter = Router();

hostingMasterRouter.get('/getHostingId/:companyId',(req,res) => getHostingId(req,res));

hostingMasterRouter.post('/addUpdateHostingMaster' , (req , res) => addUpdateHostingMaster(req , res));

hostingMasterRouter.get('/getHostingMasterDetails/:companyId' , (req , res) => getHostingMasterDetails(req , res));

hostingMasterRouter.post('/updateHostStatus', (req,res) =>updateStatus(req,res));

hostingMasterRouter.delete('/deleteHostingMasterDetails/:hostingId/:companyId',(req, res) => deleteHostingMasterDetails(req, res));


export default hostingMasterRouter