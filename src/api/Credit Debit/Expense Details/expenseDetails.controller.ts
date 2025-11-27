import { Router } from "express";
import { addUpdateExpenseDetails, deleteExpenseTypeDetails, getDebitId, getExpenseDetails } from "./expenseDetails.service";
import { auth } from "../../../shared/helper";

const expenseDetailsRouter = Router();

expenseDetailsRouter.get('/getDebitId/:companyId', auth , (req,res) => getDebitId(req,res));

expenseDetailsRouter.post('/addUpdateExpenseDetails', auth , (req , res) => addUpdateExpenseDetails(req , res));

expenseDetailsRouter.get('/getExpenseDetails/:companyId', auth , (req , res) => getExpenseDetails(req , res));

expenseDetailsRouter.delete('/deleteExpenseDetails/:debitId/:userId/:companyId', auth ,(req, res) => deleteExpenseTypeDetails(req, res));


export default expenseDetailsRouter;