import { Router } from "express";
import { getCustomerId } from "./newCustomer.service";
import { addUpdateCompanyRegistration } from "../companyRegistration/companyRegistration.service";

const newCustomerRegistrationRouter = Router();

newCustomerRegistrationRouter.get('/getCustomerId' ,(req,res) => getCustomerId(req,res));


newCustomerRegistrationRouter.post('/addUpdateNewCustomerRegistration', (req,res) =>addUpdateCompanyRegistration(req,res));

export default newCustomerRegistrationRouter