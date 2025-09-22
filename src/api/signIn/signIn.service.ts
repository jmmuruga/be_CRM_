import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";
import { logOutDto } from "./signIn.dto";

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
    
    if (user.Password !== payload.Password) {
      throw new ValidationException("Username or Password is Wrong");
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
    console.error("SignIn Error:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
  
};


export const logOut = async (req: Request, res: Response) => {
  const payload : logOutDto = req.body;

  if (!payload.userId) {
    return res.status(400).send({ error: "UserId is required to logout" });
  }

  try {
    const now = new Date().toLocaleTimeString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const logsPayload: logsDto = {
      userId: payload.userId,
      userName: null,
      statusCode: "200",
      message: `Session Ended At ${now} By User - `,
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
