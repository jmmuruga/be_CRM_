import { Router } from "express";
import { addUpdateUserDetails, deleteUser, forgetPasswordOtp, getUserDetails, getUserId, resetUserPassword, sendOtpForgetPassword, updateUserStatus, verifyOtpUserPassword } from "./userDetails.service";
import { auth } from "../../../shared/helper";

const userDetailsRouter = Router();

userDetailsRouter.get('/getUserId' , auth , (req,res) => getUserId(req,res));

userDetailsRouter.post('/addUpdateUserDetails' , auth , (req , res) => addUpdateUserDetails(req , res));

userDetailsRouter.get('/getUserDetails' , auth , (req,res) => getUserDetails(req , res));

userDetailsRouter.post('/updateStatusForUser' , auth , (req,res) => updateUserStatus(req,res));

userDetailsRouter.delete('/deleteUser/:userId/:deletedUserId/:companyId' , auth , (req,res) => deleteUser(req,res));

userDetailsRouter.get('/forgetPasswordOtp/:Email', auth , (req, res) => forgetPasswordOtp(req, res))

userDetailsRouter.get('/sendOtpForgetPassword/:Email', auth , (req, res) => sendOtpForgetPassword(req, res))

userDetailsRouter.get('/verifyOtpUserPassword/:userId/:otp', auth , (req, res) => verifyOtpUserPassword(req, res) );

userDetailsRouter.post('/resetUserPassword' , auth , (req,res) => resetUserPassword(req,res));

export default userDetailsRouter



























