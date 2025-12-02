import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateCreditDebitType, deleteCreditDebitType, getCreditDebitTypeDetails, getCreditDebitTypeId, updateCreditDebitTypeStatus } from "./creditDebitType.service";

const creditDebitTypeRouter = Router();

creditDebitTypeRouter.get('/getCreditDebitTypeId/:companyId' ,auth,(req,res) => getCreditDebitTypeId(req,res));

creditDebitTypeRouter.post('/addUpdateCreditDebitType', auth, (req, res) => addUpdateCreditDebitType(req, res));

creditDebitTypeRouter.get('/getCreditDebitTypeDetails/:companyId', auth , (req,res) =>getCreditDebitTypeDetails(req,res));

creditDebitTypeRouter.post('/updateCreditDebitTypeStatus', auth, (req, res) => updateCreditDebitTypeStatus(req, res));

creditDebitTypeRouter.delete('/deleteCreditDebitType/:creditDebitId/:userId/:companyId', auth , (req, res) => deleteCreditDebitType(req, res));

export default creditDebitTypeRouter;