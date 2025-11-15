import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateCreditDebit, deleteCreditDebit, getCreditDebitDetails, getCreditDebitId, updateCreditDebitStatus, } from "./credit-debit.service";

const creditDebitRouter = Router();

creditDebitRouter.get('/getCreditDebitId' ,auth,(req,res) => getCreditDebitId(req,res));

creditDebitRouter.post('/addUpdateCreditDebit', auth, (req, res) => addUpdateCreditDebit(req, res));

creditDebitRouter.get('/getCreditDebitDetails', auth , (req,res) =>getCreditDebitDetails(req,res));

creditDebitRouter.post('/updateCreditDebitStatus', auth, (req, res) => updateCreditDebitStatus(req, res));

creditDebitRouter.delete('/deleteCreditDebit/:creditDebitId/:userId/:companyId', auth , (req, res) => deleteCreditDebit(req, res));


export default creditDebitRouter;