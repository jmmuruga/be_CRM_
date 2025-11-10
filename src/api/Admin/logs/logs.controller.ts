import { Router } from "express";
import { getLogsReport } from "./logs.service";
import { auth } from "../../../shared/helper";

const logsRouter = Router();

logsRouter.get('/getLogsReport/:fromDate/:toDate/:userId/:companyId', auth ,(req,res)=>getLogsReport(req, res));

export default logsRouter

