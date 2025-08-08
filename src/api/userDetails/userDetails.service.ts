import { appSource } from "../../core/dataBase/db";
import { Request, Response } from "express";
import { ValidationException } from "../../core/exception";
import { userDetails } from "./userDetails.model";
import { userDetailsDto, userDetailsValidation } from "./userDetails.dto";

export const getUserId = async (req: Request, res: Response) => {
  try {
    const userDetailsRepositry =
      appSource.getRepository(userDetails);
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

export const addUpdateUserDetails = async (
  req: Request,
  res: Response
) => {
  try {
    const payload: userDetailsDto = req.body;
    const validation = userDetailsValidation.validate(payload);
    if(validation.error){
         throw new ValidationException(
                validation.error.message
            );
    }
    const userDetailsRepositry =
      appSource.getRepository(userDetails);
    const existingDetails = await userDetailsRepositry.findOneBy({
      userId: payload.userId,
    });
    if (existingDetails) {
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
        const userNameValidation = await userDetailsRepositry.findOneBy({userName:payload.userName})
        if (userNameValidation){
            throw new ValidationException(
                'User Name Already Exist '
            );

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


export const getUserDetails = async(req : Request , res : Response) =>{
  try{
    const userDetailsRepositry = appSource.getRepository(userDetails);
    const users = await userDetailsRepositry
    .createQueryBuilder('')
    .getMany();
    res.status(200).send({
        Result: users
      });
  }
  catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error);
  }
}