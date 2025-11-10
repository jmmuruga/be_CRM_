import { Router } from "express";
import { addUpdateServiceProvider, deleteServiceProviderDetails, getServiceProviderDetails, getServiceProviderId, updateStatus } from "./serviceProviderMaster.service";
import { auth } from "../../../shared/helper";

const serviceProviderRouter = Router();

serviceProviderRouter.get('/getServiceProviderId/:companyId', auth , (req,res) => getServiceProviderId(req,res));

serviceProviderRouter.post('/addUpdateServiceProvider' , auth , (req,res) => addUpdateServiceProvider(req,res));

serviceProviderRouter.get('/getServiceProviderDetails/:companyId' , auth , (req , res) => getServiceProviderDetails(req , res));

serviceProviderRouter.post('/updateServiceProviderStatus', auth , (req,res) =>updateStatus(req,res));

serviceProviderRouter.delete('/deleteServiceProvider/:serviceProviderId/:userId/:companyId', auth , (req, res) => deleteServiceProviderDetails(req, res));


export default serviceProviderRouter