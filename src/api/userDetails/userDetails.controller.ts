import { Router } from "express";
import { addUpdateUserDetails, getUserNameId } from "./userDetails.service";

const userDetailsRouter = Router();

userDetailsRouter.get('/getUserNameId' , (req,res) => getUserNameId(req,res));

userDetailsRouter.post('/addUpdateUserDetails' , (req , res) => addUpdateUserDetails(req , res));


export default userDetailsRouter