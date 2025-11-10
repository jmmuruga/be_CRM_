import { NextFunction } from "express";
import { UnauthenticatedException } from "../core/exception";
import { Request , Response } from "express";
import { appSource } from "../core/dataBase/db";
import { userDetails } from "../api/Admin/userDetails/userDetails.model";
import jwt from "jsonwebtoken";



export async function getChangedProperty<T>(
  editedPayload: any[], //after edit
  legacyPayload: any[] //before edit
): Promise<string> {
  let changedPropertyList: string = "";
  editedPayload.forEach((ele, index) => {
    const obj = legacyPayload[index];
    Object.keys(ele).forEach((key) => {
      if (
        ele[key] != obj[key] &&
        key !== "employeeImage" &&
        key !== "companyImage"
      ) {
        changedPropertyList +=
          `${key} Changed From ${obj[key]} To ${ele[key]}` + ", ";
      }
    });
  });
  return changedPropertyList;
}

export function generateOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export function getFullMonthYearAndDate(date: string): string {
  const parsedDate = new Date(date);
  const year = parsedDate.getFullYear();
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = parsedDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Formatter function
export function getFormattedLocalDateTime(date: Date = new Date()): string {
  const pad = (n: number, width = 2) => n.toString().padStart(width, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const millis = pad(date.getMilliseconds(), 3).padEnd(7, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${millis}`;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerToken = req.headers.authorization?.split("Bearer ")[1];
  
    if (!bearerToken) {
      throw new UnauthenticatedException("Unauthenticated Access");
    }
   

    const jwtVerification = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET_KEY as string
    );


    if (typeof jwtVerification === "string" || !jwtVerification) {
      throw new UnauthenticatedException("Unauthenticated Access");
    }


    const userRepository = appSource.getRepository(userDetails);
    const user = userRepository.findOneBy({
      userId: jwtVerification?.userId,
    });

    if (!user) {
      throw new UnauthenticatedException("Unauthenticated Access");
    }
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthenticated Access" });
  }
};