import { Router } from "express";
import { addUpdateServiceProvider, deleteServiceProviderDetails, getServiceProviderDetails, getServiceProviderId, updateStatus } from "./serviceProviderMaster.service";

const serviceProviderRouter = Router();

serviceProviderRouter.get('/getServiceProviderId/:companyId' , (req,res) => getServiceProviderId(req,res));

serviceProviderRouter.post('/addUpdateServiceProvider' , (req,res) => addUpdateServiceProvider(req,res));

serviceProviderRouter.get('/getServiceProviderDetails/:companyId' , (req , res) => getServiceProviderDetails(req , res));

serviceProviderRouter.post('/updateServiceProviderStatus', (req,res) =>updateStatus(req,res));

serviceProviderRouter.delete('/deleteServiceProvider/:serviceProviderId/:companyId',(req, res) => deleteServiceProviderDetails(req, res));


export default serviceProviderRouter