import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { logOutDto } from "./signIn.dto";
import { companyRegistration } from "../companyRegistration/companyRegistration.model";
import * as crypto from "crypto";


export const signIn = async (req: Request, res: Response) => {
  const payload = req.body;
    const userRepository = appSource.getRepository(userDetails);

    let user = await userRepository.findOneBy({ Email: payload.userName });
    if (!user) {
      user = await userRepository.findOneBy({ Mobile: payload.userName });
    }
    if (!user) {
      user = await userRepository.findOneBy({ userName: payload.userName });
    }
    if (!user) {
      throw new ValidationException("User does not exist");
    }
  try {
    const encryptedPassword = await encryptString(payload.Password, "ABCXY123");
     if (user.Password != encryptedPassword) {
            throw new ValidationException("Incorrect Password !");
        }


    const now = new Date().toLocaleTimeString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
    const logsPayload: logsDto = {
      userId: user.userId,
      userName: null,
      statusCode: '200',
      message: `Session Started At ${now} By User - `,
      companyId: null
    }
    await InsertLog(logsPayload);


    return res.status(200).send({
  Result: {
    userId: user.userId,
    Email: user.Email,
    Mobile: user.Mobile,
    userName: user.userName,
    userType: user.userType,
    Password: user.Password,
    confirmPassword:user.confirmPassword,
  },
});

  } catch (error: any) {
    const logPayload: logsDto = {
      userId: user.userId,
      userName: null,
      statusCode: '400',
      message: `Error While Starting The Session - ${error.message} By User - `,
      companyId: null
    }
    await InsertLog(logPayload);
    if (error instanceof ValidationException) {
      
      return res.status(400).send({ error: error.message });
    }
    // console.error("SignIn Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
  
};


export const logOut = async (req: Request, res: Response) => {
  const payload : logOutDto = req.body;

  if (!payload.userId) {
    return res.status(400).send({ error: "UserId is required to logout" });
  }

  try {
    const now = new Date().toLocaleTimeString("en-US",{
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const companyRepositry = appSource.getRepository(companyRegistration);
    const currentCompany = await companyRepositry.findOneBy({companyId : payload.companyId})

    const logsPayload: logsDto = {
      userId: payload.userId,
      userName: null,
      statusCode: "200",
      message: payload.islogout ? `Session Ended At ${now} By User - `: `Current Company Changed To ${currentCompany.companyName} At ${now} By User -`,
      companyId: payload.companyId,
    };

    await InsertLog(logsPayload);
    return res.status(200).send({
      Result: {
        message: "Logout Successful",
        userId: payload.userId,
      },
    });
  } catch (error: any) {
    const logPayload: logsDto = {
      userId: payload.userId || null,
      userName: null,
      statusCode: "400",
      message: `Error While Ending The Session - ${error.message} By User - `,
      companyId: null,
    };
    await InsertLog(logPayload);

    if (error instanceof ValidationException) {
      return res.status(400).send({ error: error.message });
    }

    console.error("Logout Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
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

