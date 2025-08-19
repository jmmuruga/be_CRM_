import { Router } from "express";
import { addUpdateEmployeeRegistration, deleteEmployee, getEmployeeDetails, getEmployeeId, updateEmployeeStatus } from "./employeeRegistration.service";

const employeeRegistrationRouter = Router();

employeeRegistrationRouter.get('/getEmployeeId' , (req,res) => getEmployeeId(req,res));

employeeRegistrationRouter.post('/addUpdateEmployeeRegistration' , (req , res) => addUpdateEmployeeRegistration(req , res));

employeeRegistrationRouter.get('/getEmployeeDetails' , (req , res) => getEmployeeDetails(req , res));

employeeRegistrationRouter.post('/updateStatusForEmployee' , (req , res) => updateEmployeeStatus(req ,res));

employeeRegistrationRouter.delete('/deleteEmployee/:employeeId' , (req , res) => deleteEmployee(req ,res));



export default employeeRegistrationRouter