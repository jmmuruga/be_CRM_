import { Router } from "express";
import { addUpdateUserDetails, getUserDetails, getUserId } from "./userDetails.service";

const userDetailsRouter = Router();

userDetailsRouter.get('/getUserId' , (req,res) => getUserId(req,res));

userDetailsRouter.post('/addUpdateUserDetails' , (req , res) => addUpdateUserDetails(req , res));

userDetailsRouter.get('/getUserDetails' , (req,res) => getUserDetails(req , res));


export default userDetailsRouter