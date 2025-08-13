import { Router } from "express";
import { addUpdateCustomerRegistration, deleteCustomerDetails, getCustomerDetails, getCustomerId, updateStatus, } from "./newCustomer.service";

const newCustomerRegistrationRouter = Router();

newCustomerRegistrationRouter.get('/getCustomerId' ,(req,res) => getCustomerId(req,res));

newCustomerRegistrationRouter.post('/addUpdateCustomerRegistration', (req,res) =>addUpdateCustomerRegistration(req,res));

newCustomerRegistrationRouter.get('/getCustomerDetails', (req,res) =>getCustomerDetails(req,res));

newCustomerRegistrationRouter.post('/updateCustomerStatus', (req,res) =>updateStatus(req,res));

newCustomerRegistrationRouter.delete('/deleteCustomerDetails/:customerId',(req, res) => deleteCustomerDetails(req, res));




export default newCustomerRegistrationRouter