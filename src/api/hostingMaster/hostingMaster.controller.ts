import { Router } from "express";
import { addUpdateHostingMaster, getHostingId } from "./hostingMaster.service";

const hostingMasterRouter = Router();

hostingMasterRouter.get('/getHostingId/:companyId',(req,res) => getHostingId(req,res));

hostingMasterRouter.post('/addUpdateHostingMaster' , (req , res) => addUpdateHostingMaster(req , res));

export default hostingMasterRouter