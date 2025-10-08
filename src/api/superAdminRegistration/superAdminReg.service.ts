import { Request, Response, text } from "express";
import { superAdminRegistrationDto, superAdminRegistrationValidation } from "./superAdminReg.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../userDetails/userDetails.model";
import { encryptString } from "../userDetails/userDetails.service";
import { generateOtp } from "../../shared/helper";
import nodemailer from "nodemailer";
import { forgetPasswordOtpStore } from "../getOtpForgetPassword/getOtpForgetPassword.model";


export const addSuperAdminRegistration = async (req: Request, res: Response) => {
    const payload: superAdminRegistrationDto = req.body;
    try {
 if (!payload.createdBy_userId || payload.createdBy_userId === '') {
      payload.createdBy_userId = payload.userId;
    }
        const validation = superAdminRegistrationValidation.validate(payload);
        if (validation.error) {
            throw new ValidationException(validation.error?.message);
        }
        const userDetailsRepository = await appSource.getRepository(userDetails);
        const userDetailFromDb = await userDetailsRepository
            .createQueryBuilder()
            // .where("userDetail.userId = :userId", {
            //     userId: payload.userId,
            // })
            // .orWhere("userDetail.Email = :Email", {
            //     Email: payload.Email,
            // })
            .where({ Email:payload.Email })
            .getMany();
        if (userDetailFromDb?.length) {
            throw new ValidationException("User Alredy Exist");
        }
        payload.Password = await encryptString(payload.Password, "ABCXY123");
        payload.confirmPassword = await encryptString(payload.confirmPassword,"ABCXY123");
        payload.companyId = '1'
        await userDetailsRepository.save(payload);
        res.status(200).send({
            IsSuccess: "Super Admin Registered Successfully",
        });
    } catch (error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error.message);
    }
};

export const sendOtpSuperAdmin = async (req:Request,res:Response) => {
    try{
        const userName = req.params.userName;
        const userId = req.params.userId;
        const Email = req.params.Email;
        const Mobile = req.params.Mobile;
        const userDetailsRepository = appSource.getRepository(userDetails);
        const userDetail = await userDetailsRepository
        .createQueryBuilder("user")
        .where ("user.Mobile = :Mobile",{
            Mobile : Mobile,
        })
        .orWhere("user.Email = :Email",{
            Email : Email
        }).getMany();
        if (userDetail?.length){
            throw new ValidationException("User Already Exist");
        }

        const generatedOtp = generateOtp();
        let response : any ;
        const transporter = nodemailer.createTransport({
            service : "gmail",
            port : 465,
            secure : false,
            auth:{
                 user: "savedatain@gmail.com",
                 pass: "unpk bcsy ibhp wzrm",
            },
        });
        response = await transporter.sendMail({
            from : "savedatain@gmail.com",
            to : "savedatamadhavashanmugam@gmail.com",
            subject : `OTP To Register Super Admin ${userName}`,
            text : `Please Enter The OTP : ${generatedOtp} To Register A Super Admin Account, User Name : ${userName},
            Email: ${Email} , Mobile Number: ${Mobile}`,
        });
        const OtpRepositry = appSource.getRepository(forgetPasswordOtpStore);
            const otpTablePayload = {
              userId: userId,
              otp: generatedOtp,
            };
            await OtpRepositry.save(otpTablePayload);
            
            console.log(generatedOtp , 'generated otp')
            // console.log(res, "test");
        
            res.status(200).send({
              IsSuccess: "OTP Sent Successfully",
            });

    }
    catch(error) {
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error.message,
            });
        }
        res.status(500).send(error);
    }
}

export const verifyOtpSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.params; 
    if (!userId || !otp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Invalid UserId or OTP Received",
      });
    }
    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    //  Find OTP for this user
    const storedOtp = await OtpRepository.findOne({ where: { userId } });

    if (!storedOtp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "OTP Not Found or Expired",
      });
    }

    //  Check if OTP matches (convert both to string)
    if (storedOtp.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Invalid OTP",
      });
    }

    //  If OTP matches, delete it from DB
    await OtpRepository.delete({ userId });

    // Send success response
    return res.status(200).json({
      IsSuccess: "OTP Verified Successfully!",
      message: "OTP Verified Successfully!",
    });
  } catch (error) {
    // console.error("verifyOtpUserPassword error:", error);
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Something Went Wrong!",
    });
  }
};





