import { Request, Response } from "express";
import { pinSettingDto, pinSettingValidation } from "./pinSeting.dto";
import {
  decrypter,
  encryptString,
  forgetPasswordOtp,
} from "../userDetails/userDetails.service";
import { pinSetting } from "./pinSeting.model";
import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { generateOtp, getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import nodemailer from "nodemailer";
import { forgetPasswordOtpStore } from "../../getOtpForgetPassword/getOtpForgetPassword.model";

export const addUpdatePinSetting = async (req: Request, res: Response) => {
  const payload: pinSettingDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  // const companyId = payload.companyId;
  const validation = pinSettingValidation.validate(payload);
  try {
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const { addPin, editPin, deletePin } = payload;
    if (addPin === editPin || addPin === deletePin || editPin === deletePin) {
      return res.status(400).send({
        message: "Add, Edit, and Delete Pin, All Must Be Different.",
      });
    }
    const otpPinRepostory = appSource.getRepository(pinSetting);
    if (payload.addPin) {
      payload.addPin = encryptString(payload.addPin, "ABCXY123");
    }
    if (payload.editPin) {
      payload.editPin = encryptString(payload.editPin, "ABCXY123");
    }
    if (payload.deletePin) {
      payload.deletePin = encryptString(payload.deletePin, "ABCXY123");
    }
    const existingDetails = await otpPinRepostory.findOneBy({
      pinId: payload.pinId,
      // companyId: payload.companyId,
    });
    if (existingDetails) {
      payload.editedBy_userId = payload.editedBy_userId || userId;
    }
    if (existingDetails) {
      await otpPinRepostory
        .update({ pinId: payload.pinId }, payload)
        .then(async () => {
          const updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Pin Setting Updated Changes - ${updatedFields} By User - `,
            companyId: "1",
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "OTP Pin Setting Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Pin Setting - ${error.message} By User -`,
            companyId: "1",
          };
          await InsertLog(logsPayload);
          res.status(500).send(error.message);
        });
    } else {
      payload.createdBy_userId = userId;
      payload.editedBy_userId = null;
      await otpPinRepostory.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: ` Pin Setting Added By User -`,
        companyId: "1",
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: " Pin Saved Successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Pin Setting By User -`,
      companyId: "1",
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send(error.message);
  }
};

export const getPinSettingDetails = async (req: Request, res: Response) => {
  try {
    const pinSetingRepositry = appSource.getRepository(pinSetting);
    const pinSeting = await pinSetingRepositry.createQueryBuilder("").getMany();
    pinSeting.forEach((x) => {
      x.addPin = decrypter(x.addPin) || x.addPin;
      x.editPin = decrypter(x.editPin) || x.editPin;
      x.deletePin = decrypter(x.deletePin) || x.deletePin;
    });
    res.status(200).send({
      Result: pinSeting,
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

export const sendOtpPinSetting = async (req: Request, res: Response) => {
  try {
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
    //   to: "info@savedata.in",
    //   subject: `OTP to Save & Update Your PinSetting ${userName}`,
    //   text: `Your OTP: ${generatedOtp}\nUsername: ${userName}\nEmail: ${Email}\nMobile: ${Mobile}`,
    // });

    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    const otpTablePayload = {
      userId: "1",
      otp: generatedOtp,
    };
    await OtpRepository.save(otpTablePayload);
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
  }
};

export const verifyOtpPinSetting = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.params;

    if (!userId || !otp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "Invalid UserId or OTP received",
      });
    }

    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    const storedOtp = await OtpRepository.findOneBy({ userId: userId });

    if (!storedOtp) {
      return res.status(400).json({
        IsSuccess: false,
        ErrorMessage: "OTP Not Found or Expired ! !",
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

export const sendOtpPinSettingCompany = async (req: Request, res: Response) => {
  try {
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
    //   to: "info@savedata.in",
    //   subject: `OTP to Save Your Company Details : ${userName}`,
    //   text: `Your OTP: ${generatedOtp}\nUsername: ${userName}\nEmail: ${Email}\nMobile: ${Mobile}`,
    // });

    const OtpRepository = appSource.getRepository(forgetPasswordOtpStore);
    const otpTablePayload = {
      userId: "1",
      otp: generatedOtp,
    };
    await OtpRepository.save(otpTablePayload);
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
  }
};

export const verifyDeletePin = async (req: Request, res: Response) => {
  const { companyId,userId,deletePin } = req.params;
  try {

    const otpPinRepostory = appSource.getRepository(pinSetting);
    const pin = await otpPinRepostory.findOne({
      where: { deletePin: encryptString(deletePin, "ABCXY123") },
    });

    if (!pin) {
      return res.status(400).json({ ErrorMessage: "Invalid Delete Pin Found" });
    }

    const decryptedDeletePin = pin.deletePin ? decrypter(pin.deletePin) : null;
    if (!decryptedDeletePin) {
      return res
        .status(400)
        .json({ ErrorMessage: "Delete Pin Not Available." });
    }

    if (decryptedDeletePin === deletePin) {
      return res
        .status(200)
        .json({ IsSuccess: "Delete Pin Verified Successfully." });
    } else {
      // logs
      const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "200",
      message: `Delete Pin Does Not Match. : ${companyId} - By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);


      return res
        .status(400)
        .json({ ErrorMessage: "Delete Pin Does Not Match." });
    }
  } catch (error) {
      const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Verifying Delete Pin : ${companyId} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    console.error(error);
    return res
      .status(500)
      .json({ ErrorMessage: error.message || "Internal Server Error" });
  }
};




export const verifyEditPin = async (req: Request, res: Response) => {
  try {
    const { editPin } = req.params;
    const otpPinRepostory = appSource.getRepository(pinSetting);
    const pin = await otpPinRepostory.findOne({
      where: { editPin: encryptString(editPin, "ABCXY123") },
    });
    if (!pin) {
      return res.status(400).json({ ErrorMessage: "Invalid Edit Pin Found" });
    }

    const decryptedEditPin = pin.editPin ? decrypter(pin.editPin) : null;
    if (!decryptedEditPin) {
      return res.status(400).json({ ErrorMessage: "Edit Pin Not Available." });
    }

    if (decryptedEditPin === editPin) {
      return res
        .status(200)
        .json({ IsSuccess: "Edit Pin Verified Successfully." });
    } else {
      return res.status(400).json({ ErrorMessage: "Edit Pin Does Not Match." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};


export const verifyAddPin = async (req: Request, res: Response) => {
  try {
    const { addPin } = req.params;
    const otpPinRepostory = appSource.getRepository(pinSetting);
    const pin = await otpPinRepostory.findOne({
      where: { addPin: encryptString(addPin, "ABCXY123") },
    });
    if (!pin) {
      return res.status(400).json({ ErrorMessage: "Invalid Add Pin Found" });
    }

    const decryptedAddPin = pin.editPin ? decrypter(pin.addPin) : null;
    if (!decryptedAddPin) {
      return res.status(400).json({ ErrorMessage: "Add Pin Not Available." });
    }

    if (decryptedAddPin === addPin) {
      return res
        .status(200)
        .json({ IsSuccess: "Add Pin Verified Successfully." });
    } else {
      return res.status(400).json({ ErrorMessage: "Add Pin Does Not Match." });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
