import { Router } from "express";
import { addUpdateUserDetails, deleteUser, getUserDetails, getUserId, updateUserStatus } from "./userDetails.service";

const userDetailsRouter = Router();

userDetailsRouter.get('/getUserId' , (req,res) => getUserId(req,res));

userDetailsRouter.post('/addUpdateUserDetails' , (req , res) => addUpdateUserDetails(req , res));

userDetailsRouter.get('/getUserDetails' , (req,res) => getUserDetails(req , res));

userDetailsRouter.post('/updateStatusForUser' , (req,res) => updateUserStatus(req,res));

userDetailsRouter.delete('/deleteUser/:userId' , (req,res) => deleteUser(req,res));


export default userDetailsRouter