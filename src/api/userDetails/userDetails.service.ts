import { appSource } from "../../core/dataBase/db";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { userDetails } from "./userDetails.model";
import {
  userDetailsDto,
  userDetailsStatus,
  userDetailsValidation,
} from "./userDetails.dto";
import { Not } from "typeorm";

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
  try {
    const payload: userDetailsDto = req.body;
    const validation = userDetailsValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const userDetailsRepositry = appSource.getRepository(userDetails);
    const existingDetails = await userDetailsRepositry.findOneBy({
      userId: payload.userId,
    });
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
          res.status(200).send({
            IsSuccess: "User Details Updated SuccessFully",
          });
        })
        .catch(async (error) => {
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
      res.status(200).send({
        IsSuccess: "User Details Added successFully",
      });
    }
  } catch (error) {
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
  try {
    const userstatus: userDetailsStatus = req.body;
    const userRepoistry = appSource.getRepository(userDetails);
    const userFound = await userRepoistry.findOneBy({
      userId: userstatus.userId,
    });
    if (!userFound) {
      throw new ValidationException("User Not Found");
    }
    await userRepoistry
      .createQueryBuilder()
      .update(userDetails)
      .set({ status: userstatus.status })
      .where({ userId: userstatus.userId })
      .execute();

    res.status(200).send({
      IsSuccess: `Status for ${userFound.userName} Changed Successfully`,
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

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userRepoistry = appSource.getRepository(userDetails);
    const userFound = await userRepoistry.findOneBy({
      userId: userId,
    });
    if (!userFound) {
      throw new ValidationException("User Not Found");
    }
       await userRepoistry
      .createQueryBuilder()
      .delete()
      .from(userDetails)
      .where({ userId: userId })
      .execute();

    res.status(200).send({
      IsSuccess: `${userFound.userName} Deleted Successfully`,
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
