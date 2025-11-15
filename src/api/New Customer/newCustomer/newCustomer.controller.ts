import { Router } from "express";
import { addUpdateCustomerRegistration, deleteCustomerDetails, getCustomerDetails, getCustomerId, updateStatus, } from "./newCustomer.service";
import { auth } from "../../../shared/helper";

const newCustomerRegistrationRouter = Router();

newCustomerRegistrationRouter.get('/getCustomerId' , auth ,(req,res) => getCustomerId(req,res));

newCustomerRegistrationRouter.post('/addUpdateCustomerRegistration', auth , (req,res) =>addUpdateCustomerRegistration(req,res));

newCustomerRegistrationRouter.get('/getCustomerDetails', auth , (req,res) =>getCustomerDetails(req,res));

newCustomerRegistrationRouter.post('/updateCustomerStatus', auth , (req,res) =>updateStatus(req,res));

newCustomerRegistrationRouter.delete('/deleteCustomerDetails/:customerId/:userId/:companyId', auth , (req, res) => deleteCustomerDetails(req, res));


export default newCustomerRegistrationRouter