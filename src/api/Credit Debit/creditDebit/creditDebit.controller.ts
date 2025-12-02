import { Router } from "express";
import { getCreditDebitId } from "./creditDebit.service";
import { auth } from "../../../shared/helper";

const creditDebitRouter = Router();

creditDebitRouter.get('/getCreditDebitId/:companyId', auth , (req,res) => getCreditDebitId(req,res));

export default creditDebitRouter;