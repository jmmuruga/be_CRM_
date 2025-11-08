import { appSource } from "../../../core/dataBase/db";
import { Request, Response } from "express";
import { ValidationException } from "../../../core/exception";
import { userDetails } from "./userDetails.model";
import {
  resetUserPasswordValidation,
  userDetailsDto,
  userDetailsStatusDto,
  userDetailsValidation,
} from "./userDetails.dto";
import { Not } from "typeorm";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import {  generateOtp, getChangedProperty } from "../../../shared/helper";
import * as crypto from "crypto";
import nodemailer from "nodemailer";
import { forgetPasswordOtpStore } from "../../getOtpForgetPassword/getOtpForgetPassword.model";
import { companyRegistration } from "../companyRegistration/companyRegistration.model";

export const getUserId = async (req: Request, res: Response) => {
  try {
    const userDetailsRepositry = appSource.getRepository(userDetails);
    let userId = await userDetailsRepositry.query(
      `SELECT userId
            FROM [${process.env.DB_NAME}].[dbo].[user_details]
            Group by userId
            ORDER BY CAST(userId AS INT) DESC;`
    );

    let id = "0";
    if (userId?.length > 0) {
      id = userId[0].userId;
    }
    const finalRes = Number(id) + 1;
    res.status(200).send({
      Result: finalRes,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const addUpdateUserDetails = async (req: Request, res: Response) => {
  const payload: userDetailsDto = req.body;
  
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  

  try {
    payload.Password = await encryptString(payload.Password, "ABCXY123");
    payload.confirmPassword = await encryptString(payload.confirmPassword,"ABCXY123");

    const validation = userDetailsValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const userDetailsRepositry = appSource.getRepository(userDetails);
    const existingDetails = await userDetailsRepositry.findOneBy({
      userId: payload.userId,
    });
    delete payload.companyId;

    if (existingDetails) {
      const userNameValidation = await userDetailsRepositry.findOneBy({
        userName: payload.userName,
        userId: Not(payload.userId),
      });
      if (userNameValidation) {
        throw new ValidationException("User Name Already Exist ");
      }

      const emailValidation = await userDetailsRepositry.findOneBy({
        Email: payload.Email,
        userId: Not(payload.userId),
      });
      if (emailValidation) {
        throw new ValidationException("Email Address Already Exist ");
      }

      const mobileValidation = await userDetailsRepositry.findOneBy({
        Mobile: payload.Mobile,
        userId: Not(payload.userId),
      });
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist ");
      }

      await userDetailsRepositry
        .update({ userId: payload.userId }, payload)
        .then(async (r) => {
          let updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `User Details Updated For"${payload.userName}" Updated - Changes : ${updatedFields}By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "User Details Updated SuccessFully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating User Details ${payload.userName} - ${error.message} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          if (error instanceof ValidationException) {
            return res.status(400).send({
              message: error?.message,
            });
          }
          res.status(500).send(error);
        });
      return;
    } else {
      const userNameValidation = await userDetailsRepositry.findOneBy({
        userName: payload.userName,
      });
      if (userNameValidation) {
        throw new ValidationException("User Name Already Exist ");
      }

      const EmailValidation = await userDetailsRepositry.findOneBy({
        Email: payload.Email,
      });
      if (EmailValidation) {
        throw new ValidationException("Email Address Already Exist ");
      }

      const mobileValidation = await userDetailsRepositry.findOneBy({
        Mobile: payload.Mobile,
      });
      if (mobileValidation) {
        throw new ValidationException("Mobile Number Already Exist ");
      }

      await userDetailsRepositry.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `User Details ${payload.userName} Added By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: "User Details Added successFully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding User Details ${payload.userName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    
    const userDetailsRepositry = appSource.getRepository(userDetails);
    const users = await userDetailsRepositry.createQueryBuilder("").getMany();
    users.forEach((x) => {
      x.Password = decrypter(x.Password) || x.Password;
      x.confirmPassword = decrypter(x.confirmPassword) || x.confirmPassword;
    });
    res.status(200).send({
      Result: users,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const userstatus: userDetailsStatusDto = req.body;
  const userRepoistry = appSource.getRepository(userDetails);
  const userFound = await userRepoistry.findOneBy({
    userId: userstatus.userId,
  });
  try {
    if (!userFound) {
      throw new ValidationException("User Not Found");
    }
    await userRepoistry
      .createQueryBuilder()
      .update(userDetails)
      .set({ status: userstatus.status })
      .where({ userId: userstatus.userId })
      .execute();
    const logsPayload: logsDto = {
      userId: userstatus.satusUpdatedUser,
      userName: null,
      statusCode: "200",
      message: `User Status For ${userFound.userName} changed to ${userstatus.status} By User - `,
      companyId: userstatus.companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `Status for ${userFound.userName} Changed Successfully`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userstatus.satusUpdatedUser,
      userName: null,
      statusCode: "400",
      message: `Error While Changing User Status For ${userFound.userName} to ${userstatus.status} - ${error.message} By User - `,
      companyId: userstatus.companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId, deletedUserId, companyId } = req.params;
  const userRepoistry = appSource.getRepository(userDetails);
  const userFound = await userRepoistry.findOneBy({
    userId: userId,
  });
  try {
    if (!userFound) {
      throw new ValidationException("User Not Found");
    }
    await userRepoistry
      .createQueryBuilder()
      .delete()
      .from(userDetails)
      .where({ userId: userId })
      .execute();
    const logsPayload: logsDto = {
      userId: deletedUserId,
      userName: null,
      statusCode: "200",
      message: `User Details : ${userFound.userName} Deleted By User -  `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    res.status(200).send({
      IsSuccess: `${userFound.userName} Deleted Successfully`,
    });
  } catch (error) {
    const logsPayload: logsDto = {
      userId: deletedUserId,
      userName: null,
      statusCode: "400",
      message: `Error While Deleting User Details : ${userFound.userName} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
};

export function encryptString(data: string, secreatKey: string) {
  const algorithm = process.env.algorithm || "aes-256-cbc";
  const key = Buffer.from(
    "52d1542a9ee07bb807375a552983abf2386dc5e1e7ddc66dfb78b3c8533ee63b",
    "hex"
  );
  const iv = Buffer.from("ef953c62cfcff791f31efe8cd91ac20d", "hex");
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encryptData = cipher.update(data, "utf-8", "hex");
  encryptData += cipher.final("hex");
  return encryptData;
}

export function decrypter(encryptedDate: string): string {
  try {
    const algorithm = process.env.algorithm || "aes-256-cbc";
    const key = Buffer.from(
      "52d1542a9ee07bb807375a552983abf2386dc5e1e7ddc66dfb78b3c8533ee63b",
      "hex"
    );
    const iv = Buffer.from("ef953c62cfcff791f31efe8cd91ac20d", "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decryptedDate = decipher.update(encryptedDate, "hex", "utf8");
    decryptedDate += decipher.final("utf8");
    return decryptedDate;
  } catch (err) {
    // If decrypt fails → assume it's plain text
    return encryptedDate;
  }
}

export const forgetPasswordOtp = async (req: Request, res: Response) => {
  const Email = req.params.Email;

  try {
    const userRepository = await appSource.getRepository(userDetails);
    let user = await userRepository.findOneBy({
      Email: Email,
    });
    if (!user) {
      user = await userRepository.findOneBy({
        Mobile: Email,
      });
    }
    if (!user) {
      user = await userRepository.findOneBy({
        userName: Email,
      });
    }
    if (!user) {
      throw new ValidationException("User Not Found");
    }
    if (user.userType === "5") {
      throw new ValidationException("Super Admin Cannot Reset User's Password !");
    }
    if (!user.status) {
      throw new ValidationException("User is Inactive, Please Contact Admin");
    }


    res.status(200).send({
      Result: user,
      // message: "msg sent succesfully",
    });
  } catch (error) {
  if (error instanceof ValidationException) {
    return res.status(400).send({
      message: error.message,
    });
  } else {

    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
}
};

export const sendOtpForgetPassword = async (req: Request, res: Response) => {
  try {
    const Email = req.params.Email;

    if (!Email) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Email is required",
      });
    }

    const userRepository = appSource.getRepository(userDetails);
    const user = await userRepository.findOne({ where: { Email } });

    if (!user) {
      return res.status(404).json({
        IsSuccess: false,
        ErrorMessage: "User Not Found",
      });
    }

    const generatedOtp = generateOtp();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "savedatain@gmail.com",
        pass: "unpk bcsy ibhp wzrm",
      },
    });

    // Send OTP email
//     await transporter.sendMail({
//       from: "savedatain@gmail.com",
//       to: "savedatamadhavashanmugam@gmail.com",
//       subject: "OTP to Reset User Password",
//       text: `Hello ${user.userName},
// Please Enter This OTP to Reset Your Password: ${generatedOtp}

// User Details:
// - Username: ${user.userName}
// - Email: ${Email}
// - Mobile: ${user.Mobile}
// `,
//     });
    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    await OtpRepository.save({ userId: user.userId, otp: generatedOtp });

    console.log("OTP:", generatedOtp);

    return res.status(200).json({
      IsSuccess: true,
      Message: "OTP Sent Successfully",
      Result: { userId: user.userId },
     
    });
     
  } catch (error) {

    return res.status(500).json({
      IsSuccess: false,
      ErrorMessage: "Internal Server Error",
    });
  }
};


export const verifyOtpUserPassword = async (req: Request, res: Response) => {
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
        ErrorMessage: "OTP Not Found or Expired !",
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

export const resetUserPassword = async (req: Request, res: Response) => {
  const payload: userDetailsDto = req.body;
  const userRepository = appSource.getRepository(userDetails);
    const CheckUser = await userRepository.findOneBy({ userId: payload.userId });

    if (!CheckUser) {
      throw new ValidationException("User Not Found");
    }

  try {
    
  

    const validationResponse = resetUserPasswordValidation.validate(payload);
    if (validationResponse.error) {
      throw new ValidationException(validationResponse.error?.message);
    }

    const encryptedPassword = await encryptString(payload.Password, "ABCXY123");
    const encryptedConfirmPassword = await encryptString(payload.confirmPassword, "ABCXY123");

    await userRepository
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
      userName: CheckUser.userName, 
      statusCode: "200",
      message: `Password Reset Successful for User "${CheckUser.userName}" at ${now} By User - `,
      companyId: null,
    };

    await InsertLog(logsPayload);

    return res.status(200).send({
      IsSuccess: "User Password Updated Successfully !",
    });
  } catch (error) {


    const logsPayload: logsDto = {
      userId: payload.editedBy_userId || payload.userId,
      userName: CheckUser.userName,
      statusCode: "400",
      message: `Error While Resetting Password For User "${CheckUser.userName}" : ${error.message} By User - `,
      companyId: null,
    };
    await InsertLog(logsPayload);

    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }

    return res.status(500).send({
      message: "Something went wrong!",
    });
  }
};




