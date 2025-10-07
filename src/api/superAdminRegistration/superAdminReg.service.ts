import { Request, Response } from "express";
import { superAdminRegistrationDto, superAdminRegistrationValidation } from "./superAdminReg.dto";
import { ValidationException } from "../../core/exception";
import { appSource } from "../../core/dataBase/db";
import { userDetails } from "../userDetails/userDetails.model";
import { encryptString } from "../userDetails/userDetails.service";




// export const addSuperAdminRegistration = async (req: Request, res: Response) => {
//     const payload: superAdminRegistrationDto = req.body;

//     try {
//         const validation = superAdminRegistrationValidation.validate(payload);
//         if (validation.error) {
//             throw new ValidationException(validation.error?.message);
//         }
//         const userDetailsRepositry = await appSource.getRepository(userDetails);
//         const users = await userDetailsRepositry.createQueryBuilder("")

//     }
//     catch {

//     }

// }


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
            IsSuccess: "User Registered Successfully",
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







