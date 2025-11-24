import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { userRights } from "./userRights.model";
import { userRightsDto, userRightsValidation } from "./userRights.dto";
import { ValidationException } from "../../../core/exception";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addUpdateUserRights = async (req: Request, res: Response) => {
  const payload: userRightsDto = req.body;

  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;

  try {
    // Step 1: Validate payload
    const validation = userRightsValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const userRightsRepo = appSource.getRepository(userRights);

    // Step 2: Check if user rights already exist
    const existingDetails = await userRightsRepo.findBy({
      userTypeId: payload.userTypeId,
      companyId: companyId,
    });

    // Step 3: Remove old entries for this userType & company (since we will re-insert)
    if (existingDetails && existingDetails.length > 0) {
      await userRightsRepo.delete({
        userTypeId: payload.userTypeId,
        companyId: companyId,
      });
    }

    // Step 4: Prepare new records to insert
    const rightsToInsert: userRightsDto[] = [];
    for (const moduleName in payload.selectedForms) {
      const forms = payload.selectedForms[moduleName];
      if (Array.isArray(forms)) {
        forms.forEach((form: any) => {
          rightsToInsert.push({
            userTypeId: payload.userTypeId,
            companyId: payload.companyId,
            formCode: form.formCode,
            formName: form.formName,
            parentId: form.parentId,
            createdBy_userId: payload.createdBy_userId,
            isEdited: payload.isEdited,
            editedBy_userId: payload.isEdited ? payload.editedBy_userId : null,
          });
        });
      }
    }

    if (rightsToInsert.length === 0) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: "No forms selected to save.",
      });
    }

    // Step 5: Save new records
    await userRightsRepo.save(rightsToInsert);

    // Step 6: Logs Handling (Like Theme API)
    if (existingDetails && existingDetails.length > 0) {
      // It's an update
      payload.isEdited = true;
      payload.editedBy_userId = userId;

      // Compare old vs new for logs

      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `User Rights Updated For User Type :  ${payload.userTypeId} Successfully By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);

      return res.status(200).send({
        IsSuccess: true,
        Message: "User Rights Updated Successfully !",
      });
    } else {
      // It's a new insert
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `User Rights Added For User Type :  ${payload.userTypeId} Successfully By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);

      return res.status(200).send({
        IsSuccess: true,
        Message: "User Rights Added Successfully !",
      });
    }
  } catch (error: any) {
    // Step 7: Error Handling + Logging
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding/Updating User Rights For User Type ${payload.userTypeId} - ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);

    if (error instanceof ValidationException) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: error.message,
      });
    }

    res.status(500).send({
      IsSuccess: false,
      ErrorMessage: error.message || "Internal Server Error",
    });
    return;
  }
};

export const getUserRights = async (req: Request, res: Response) => {
  try {
    const { userTypeId,companyId } = req.params;
    const userRightsRepo = appSource.getRepository(userRights);

    const userRightsList = await userRightsRepo.findBy({
      companyId: companyId,
      userTypeId: userTypeId,
    });

    res.status(200).send({
      Result: userRightsList,
    });
  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error?.message,
      });
    }
    res.status(500).send(error?.message);
  }
};


// export const getUserRights = async (req: Request, res: Response) => {
//   try {
//     const { userTypeId, companyId } = req.params; // ✅ Correct order

//     const userRightsRepo = appSource.getRepository(userRights);

//     const userRightsList = await userRightsRepo
//      .createQueryBuilder()
//       .where({ userTypeId: userTypeId ,companyId: companyId  })
//       .getMany();
//     res.status(200).send({
//       Result: userRightsList,
//     });
//   } catch (error) {
//     if (error instanceof ValidationException) {
//       return res.status(400).send({
//         message: error?.message,
//       });
//     }
//     res.status(500).send(error?.message);
//   }
// };
