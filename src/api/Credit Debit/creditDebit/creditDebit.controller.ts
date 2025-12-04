import { Router } from "express";
import { addUpdateCreditDebit, deleteCreditDebit, getCreditDebitDetails, getCreditDebitId } from "./creditDebit.service";
import { auth } from "../../../shared/helper";

const creditDebitRouter = Router();

creditDebitRouter.get('/getCreditDebitId/:companyId', auth , (req,res) => getCreditDebitId(req,res));

creditDebitRouter.post('/addUpdateCreditDebit', auth , (req,res) => addUpdateCreditDebit(req,res));

creditDebitRouter.get('/getCreditDebitDetails/:companyId', auth , (req,res) => getCreditDebitDetails(req,res));

creditDebitRouter.delete('/deleteCreditDebit/:receiptId/:userId/:companyId', auth , (req, res) => deleteCreditDebit(req, res));



export default creditDebitRouter;