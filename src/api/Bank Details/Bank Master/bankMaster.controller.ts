import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateBankMaster, deleteBankMaster, getBankMasterDetails, getBankNameId, updateBankMasterStatus } from "./bankMaster.service";

const bankMasterRouter = Router();

bankMasterRouter.get('/getBankNameId/:companyId' , auth , (req,res) => getBankNameId(req,res));

bankMasterRouter.post('/addUpdateBankMaster', auth, (req, res) => addUpdateBankMaster(req, res));   

bankMasterRouter.get('/getBankMasterDetails/:companyId' , auth , (req ,res) => getBankMasterDetails(req , res));

bankMasterRouter.post('/updateBankMasterStatus' , auth , (req , res) => updateBankMasterStatus(req ,res));

bankMasterRouter.delete('/deleteBankMaster/:bankNameId/:userId/:companyId', auth ,(req, res) => deleteBankMaster(req, res));

export default bankMasterRouter;