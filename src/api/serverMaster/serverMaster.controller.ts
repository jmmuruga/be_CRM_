import { Router } from "express";
import { getServerMasterId } from "./serverMaster.service";

const serverMasterRouter = Router();

serverMasterRouter.get('/getServerMasterId/:companyId' , (req,res) => getServerMasterId(req,res));



export default serverMasterRouter