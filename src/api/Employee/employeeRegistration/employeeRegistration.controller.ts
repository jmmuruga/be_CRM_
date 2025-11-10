import { Router } from "express";
import { addUpdateEmployeeRegistration, deleteEmployee, getEmployeeDetails, getEmployeeId, updateEmployeeStatus } from "./employeeRegistration.service";
import { auth } from "../../../shared/helper";

const employeeRegistrationRouter = Router();

employeeRegistrationRouter.get('/getEmployeeId' , auth , (req,res) => getEmployeeId(req,res));

employeeRegistrationRouter.post('/addUpdateEmployeeRegistration' , auth , (req , res) => addUpdateEmployeeRegistration(req , res));

employeeRegistrationRouter.get('/getEmployeeDetails' , auth , (req , res) => getEmployeeDetails(req , res));

employeeRegistrationRouter.post('/updateStatusForEmployee' , auth , (req , res) => updateEmployeeStatus(req ,res));

employeeRegistrationRouter.delete('/deleteEmployee/:employeeId/:userId/:companyId' , auth , (req , res) => deleteEmployee(req ,res));


export default employeeRegistrationRouter