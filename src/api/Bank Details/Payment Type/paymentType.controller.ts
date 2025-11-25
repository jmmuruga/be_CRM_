import { Router } from "express";
import { addUpdatePaymentType, deletePaymentType, getDetailsForLinkedAccNum, getPaymentTypeDetails, getPaymentTypeId, updatePaymentTypestatus } from "./paymentType.service";
import { auth } from "../../../shared/helper";

const paymentTypeRouter = Router();

paymentTypeRouter.get('/getPaymentTypeId', auth , (req,res) =>  getPaymentTypeId(req,res));

paymentTypeRouter.get('/getDetailsForLinkedAccNum/:companyId', auth , (req,res) =>  getDetailsForLinkedAccNum(req,res));

paymentTypeRouter.post('/addUpdatePaymentType', auth , (req,res) =>  addUpdatePaymentType(req,res));

paymentTypeRouter.get('/getPaymentTypeDetails/:companyId', auth , (req,res) => getPaymentTypeDetails(req,res));

paymentTypeRouter.post('/updatePaymentTypestatus' , auth , (req , res) => updatePaymentTypestatus(req ,res));

paymentTypeRouter.delete('/deletePaymentType/:paymentTypeId/:userId/:companyId', auth, (req, res) => deletePaymentType(req, res));

export default paymentTypeRouter;