import { Router } from "express";
import { addUpdateUserDetails, deleteUser, forgetPasswordOtp, getUserDetails, getUserId, resetUserPassword, sendOtpForgetPassword, updateUserStatus, verifyOtpUserPassword } from "./userDetails.service";

const userDetailsRouter = Router();

userDetailsRouter.get('/getUserId' , (req,res) => getUserId(req,res));

userDetailsRouter.post('/addUpdateUserDetails' , (req , res) => addUpdateUserDetails(req , res));

userDetailsRouter.get('/getUserDetails' , (req,res) => getUserDetails(req , res));

userDetailsRouter.post('/updateStatusForUser' , (req,res) => updateUserStatus(req,res));

userDetailsRouter.delete('/deleteUser/:userId/:deletedUserId/:companyId' , (req,res) => deleteUser(req,res));

userDetailsRouter.get('/forgetPasswordOtp/:Email', (req, res) => forgetPasswordOtp(req, res))

userDetailsRouter.get('/sendOtpForgetPassword/:Email', (req, res) => sendOtpForgetPassword(req, res))

userDetailsRouter.get('/verifyOtpUserPassword/:userId/:otp', (req, res) => verifyOtpUserPassword(req, res) );

userDetailsRouter.post('/resetUserPassword' , (req,res) => resetUserPassword(req,res));

export default userDetailsRouter



























