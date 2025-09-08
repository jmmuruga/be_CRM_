import { Request, Response } from "express";
import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../userDetails/userDetails.model";
import { ValidationException } from "../../core/exception";

export const signIn = async (req: Request, res: Response) => {
  try {
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

    if (user.Password !== payload.Password) {
      throw new ValidationException("Username or password is wrong");
    }


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
    if (error instanceof ValidationException) {
      return res.status(400).send({ error: error.message });
    }
    console.error("SignIn Error:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
};
