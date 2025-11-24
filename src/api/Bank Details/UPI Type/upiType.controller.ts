import { Router } from "express";
import { addUpdateUpiType, deleteUpiType, getUpiType, getUpiTypeId, updateUpiTypeStatus } from "./upiType.service";
import { auth } from "../../../shared/helper";

const upiTypeRouter = Router();

upiTypeRouter.get('/getUpiTypeId' , auth , (req,res) => getUpiTypeId(req,res));

upiTypeRouter.post('/addUpdateUpiType', auth, (req, res) => addUpdateUpiType(req, res));

upiTypeRouter.get('/getUpiType/:companyId', auth, (req, res) => getUpiType(req, res));

upiTypeRouter.post('/updateUpiTypeStatus', auth, (req, res) => updateUpiTypeStatus(req, res));

upiTypeRouter.delete('/deleteUpiType/:upiTypeId/:userId/:companyId', auth, (req, res) => deleteUpiType(req, res));


export default upiTypeRouter;