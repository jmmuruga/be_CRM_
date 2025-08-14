import { Router } from "express";
import { addUpdateEmployeeRegistration, getEmployeeId } from "./employeeRegistration.service";

const employeeRegistrationRouter = Router();


employeeRegistrationRouter.get('/getEmployeeId' , (req,res) => getEmployeeId(req,res));

employeeRegistrationRouter.post('/addUpdateEmployeeRegistration' , (req , res) => addUpdateEmployeeRegistration(req , res));



export default employeeRegistrationRouter