import { Router } from "express";
import { auth } from "../../../shared/helper";
import { addUpdateBankAccCreation, deleteBankAccCreation, getBankAccountCreationDetails, getBankAccountCreationId, updateBankAccountCreationStatus } from "./bankAccCreation.service";

const bankAccountCreationRouter = Router();

bankAccountCreationRouter.get('/getBankAccountCreationId' , auth , (req,res) => getBankAccountCreationId(req,res));

bankAccountCreationRouter.post('/addUpdateBankAccountCreation', auth, (req, res) => addUpdateBankAccCreation(req, res));

bankAccountCreationRouter.get('/getBankAccountCreationDetails/:companyId' , auth , (req ,res) => getBankAccountCreationDetails(req , res));

bankAccountCreationRouter.post('/updateBankAccountCreationStatus' , auth , (req , res) => updateBankAccountCreationStatus(req ,res));

bankAccountCreationRouter.delete('/deleteBankAccountCreation/:bankAccNumberCreationId/:userId/:companyId', auth, (req, res) => deleteBankAccCreation(req, res));


export default bankAccountCreationRouter;