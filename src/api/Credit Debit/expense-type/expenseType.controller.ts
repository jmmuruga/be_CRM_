import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateExpenseType, deleteExpenseType, getExpenseTypeDetails, getExpenseTypeId, updateExpenseTypeStatus } from "./expenseType.service";

const expenseTypeRouter = Router();

expenseTypeRouter.get('/getExpenseTypeId/:companyId' , auth, (req,res) => getExpenseTypeId(req, res));

expenseTypeRouter.post('/addUpdateExpenseType', auth, (req, res) => addUpdateExpenseType(req, res));

expenseTypeRouter.get('/getExpenseTypeDetails/:companyId', auth , (req,res) =>getExpenseTypeDetails(req,res));

expenseTypeRouter.post('/updateExpenseTypeStatus', auth, (req, res) => updateExpenseTypeStatus(req, res));

expenseTypeRouter.delete('/deleteExpenseType/:expenseTypeId/:userId/:companyId', auth, (req, res) => deleteExpenseType(req, res));

export default expenseTypeRouter;