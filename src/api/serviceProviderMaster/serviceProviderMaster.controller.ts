import { Router } from "express";
import { getServiceProviderId } from "./serviceProviderMaster.service";

const serviceProviderRouter = Router();

serviceProviderRouter.get('/getServiceProviderId/:companyId' , (req,res) => getServiceProviderId(req,res));

export default serviceProviderRouter