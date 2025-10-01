import { Router } from "express";
import { addUpdateUserDetails, deleteUser, forgetPasswordOtp, getUserDetails, getUserId, updateUserStatus, verifyOtpUserPassword } from "./userDetails.service";

const userDetailsRouter = Router();

userDetailsRouter.get('/getUserId' , (req,res) => getUserId(req,res));

userDetailsRouter.post('/addUpdateUserDetails' , (req , res) => addUpdateUserDetails(req , res));

userDetailsRouter.get('/getUserDetails' , (req,res) => getUserDetails(req , res));

userDetailsRouter.post('/updateStatusForUser' , (req,res) => updateUserStatus(req,res));

userDetailsRouter.delete('/deleteUser/:userId/:deletedUserId/:companyId' , (req,res) => deleteUser(req,res));

userDetailsRouter.get('/forgetPasswordOtp/:Email', (req, res) => forgetPasswordOtp(req, res))

userDetailsRouter.get('/verifyOtpUserPassword/:userId/:otp', (req, res) => verifyOtpUserPassword(req, res) );

export default userDetailsRouter



// export const verifyOtpUserPassword = async (req: Request, res: Response) => {
//     try {
//         const { userId, otp } = req.params;
//         if (!userId || !otp) {
//             throw new ValidationException("Invalid userId or otp received");
//         }

//         const OtpRepositry = appSource.getRepository(forgetPasswordOtpStore);
//         await OtpRepositry
//             .createQueryBuilder()
//             .delete()
//             .from(forgetPasswordOtpStore)
//             .where({ userId: userId })
//             .execute();
//         res.status(200).send({
//             IsSuccess: `Otp Verified Successfully...!`,
//         });
//     } catch (error) {
//         if (error instanceof ValidationException) {
//             return res.status(400).send({
//                 message: error.message,
//             });
//         }
//         res.status(500).send(error);
//     }
// };

























