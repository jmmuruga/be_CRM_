import { Router } from "express";
import { auth } from "../../../shared/helper";
import { getCreditDebitId } from "./credit-debit.service";

const creditDebitRouter = Router();

creditDebitRouter.get('/getCreditDebitId' ,auth,(req,res) => getCreditDebitId(req,res));

export default creditDebitRouter;