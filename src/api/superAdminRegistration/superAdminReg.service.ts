import { Request, Response, text } from "express";
import {
  resetSuperAdminPasswordValidation,
  superAdminRegistrationDto,
  superAdminRegistrationValidation,
} from "./superAdminReg.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../Admin/userDetails/userDetails.model";
import { encryptString } from "../Admin/userDetails/userDetails.service";
import { generateOtp } from "../../shared/helper";
import nodemailer from "nodemailer";
import { forgetPasswordOtpStore } from "../getOtpForgetPassword/getOtpForgetPassword.model";
import { InsertLog } from "../Admin/logs/logs.service";
import { logsDto } from "../Admin/logs/logs.dto";



export const sendOtpSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { userName, userId, Email, Mobile } = req.params;
    const userDetailsRepository = appSource.getRepository(userDetails);

    const userNameValidation = await userDetailsRepository.findOneBy({
      userName : userName,
    });
    if (userNameValidation) {
      throw new ValidationException("User Name Already Exists");
    }

    const EmailValidation = await userDetailsRepository.findOneBy({ Email : Email });
    if (EmailValidation) {
      throw new ValidationException("Email Address Already Exists");
    }

    const mobileValidation = await userDetailsRepository.findOneBy({ Mobile : Mobile });
    if (mobileValidation) {
      throw new ValidationException("Mobile Number Already Exists");
    }

    const userDetail = await userDetailsRepository
      .createQueryBuilder("user")
      .where("user.Mobile = :Mobile", { Mobile : Mobile })
      .orWhere("user.Email = :Email", { Email :Email })
      .getMany();

    if (userDetail?.length) {
      throw new ValidationException("User Already Exists");
    }

    const generatedOtp = generateOtp();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: false,
      auth: {
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });

    // await transporter.sendMail({
    //   from: "savedatain@gmail.com",
    //   to: "savedatamadhavashanmugam@gmail.com",
    //   subject: `OTP to Register Super Admin ${userName}`,
    //   text: `Your OTP: ${generatedOtp}\nUsername: ${userName}\nEmail: ${Email}\nMobile: ${Mobile}`,
    // });

    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    await OtpRepository.save({ userId, otp: generatedOtp });

    console.log("Generated OTP:", generatedOtp);

    // Success response
    return res.status(200).send({
      IsSuccess: true,
      Message: "OTP Sent Successfully",
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: error.message,
      });
    }


    return res.status(500).send({
      IsSuccess: false,
      ErrorMessage: "Internal Server Error",
      Details: error.message,
    });
  }
};

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
    const storedOtp = await OtpRepository.findOne({ where: { userId } });

    if (!storedOtp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "OTP Not Found or Expired",
      });
    }
    if (storedOtp.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Invalid OTP",
      });
    }
    await OtpRepository.delete({ userId });
    return res.status(200).json({
      IsSuccess: "OTP Verified Successfully!",
      message: "OTP Verified Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Something Went Wrong!",
    });
  }
};


export const addSuperAdminRegistration = async (
  req: Request,
  res: Response
) => {
  const payload: superAdminRegistrationDto = req.body;
  const companyId = payload.companyId;
  const userId = payload.createdBy_userId;

  try {
    const validation = superAdminRegistrationValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const userDetailsRepository = appSource.getRepository(userDetails);

    const userNameExists = await userDetailsRepository.findOneBy({
      userName: payload.userName,
    });
    if (userNameExists) {
      throw new ValidationException("User Name Already Exists");
    }

    const emailExists = await userDetailsRepository.findOneBy({
      Email: payload.Email,
    });
    if (emailExists) {
      throw new ValidationException("Email Address Already Exists");
    }

    const mobileExists = await userDetailsRepository.findOneBy({
      Mobile: payload.Mobile,
    });
    if (mobileExists) {
      throw new ValidationException("Mobile Number Already Exists");
    }

    payload.Password = await encryptString(payload.Password, "ABCXY123");
    payload.confirmPassword = await encryptString(
      payload.confirmPassword,
      "ABCXY123"
    );
    payload.companyId = companyId;

    await userDetailsRepository.save(payload);
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Super Admin Details ${payload.userName} Added By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    res.status(200).send({
      IsSuccess: "Super Admin Registered Successfully",
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Super Admin Details  ${payload.userName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};


export const sendOtpResetSuperAdmin = async (req:Request,res:Response) =>{
  try {
  const Email= req.params.Email;
  const userDetailsRepository = appSource.getRepository(userDetails);
  const user = await userDetailsRepository.findOne(
    {  where: [
      { Email: Email},
      { Mobile: Email}
    ], });

  if (!user) {
    throw new ValidationException("User not found!");
  }
  if (user.userType !== "5") {
    throw new ValidationException(" Only Super Admins Are Allowed To Reset Password !");
  }

    const generatedOtp = generateOtp();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: false,
      auth: {
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });

    // await transporter.sendMail({
    //   from: "savedatain@gmail.com",
    //   to: "savedatamadhavashanmugam@gmail.com",
    //   subject: `OTP to Reset Super Admin Password For ${userName}`,
    //   text: `Your OTP: ${generatedOtp}\nUsername: ${userName}\nEmail: ${Email}\nMobile: ${Mobile}`,
    // });

    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    await OtpRepository.save({ userId:user.userId, otp: generatedOtp });

    console.log("Generated OTP:", generatedOtp);

    // Success response
    return res.status(200).send({
      IsSuccess: true,
      Message: "OTP Sent Successfully",
      Result: { userId: user.userId },
    });



} catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: error.message,
      });
    }
}
}

export const verifyOtpResetSuperAdmin = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.params; 

    if (!userId || !otp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Invalid UserId or OTP received",
      });
    }

    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    const storedOtp = await OtpRepository.findOneBy({userId : userId})

    if (!storedOtp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "OTP not found or expired",
      });
    }

    if (storedOtp.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Invalid OTP",
      });
    }

    await OtpRepository.delete({ userId });
    return res.status(200).json({
      IsSuccess: true,
      Message: "OTP Verified Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Something Went Wrong!",
    });
  }
};


export const resetSuperAdminPassword = async (req: Request, res: Response) => {
  const payload: superAdminRegistrationDto = req.body;
  const userDetailsRepository = appSource.getRepository(userDetails);
  const checkUser = await userDetailsRepository.findOneBy({ userId: payload.userId });
  try {
    if (!checkUser) {
      throw new ValidationException("User Not Found");
    }
    const validation = resetSuperAdminPasswordValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error?.message);
    }
    const encryptedPassword = await encryptString(payload.Password, "ABCXY123");
    const encryptedConfirmPassword = await encryptString(payload.confirmPassword, "ABCXY123");
    await userDetailsRepository
      .createQueryBuilder()
      .update(userDetails)
      .set({
        Password: encryptedPassword,
        confirmPassword: encryptedConfirmPassword,
      })
      .where("userId = :userId", { userId: payload.userId })
      .execute();
    const now = new Date().toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const logsPayload: logsDto = {
      userId: payload.userId,
      userName: checkUser.userName,
      statusCode: "200",
      message: `Super Admin Password Reseted Successfully for ${checkUser.userName} at ${now} By User - `,
      companyId: null,
    };
    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: "Super Admin Password Updated Successfully",
    });
  } catch (error: any) {
    const logsPayload: logsDto = {
      userId: payload.userId,
      userName: checkUser.userName,
      statusCode: "400",
      message: `Error While Resetting Super Admin Password For  ${payload.userName} - ${error.message} By User - `,
      companyId: null,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};



