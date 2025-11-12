import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { userRights } from "./userRights.model";
import { userRightsDto, userRightsValidation, } from "./userRights.dto";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty, getChangedPropertyUserRights } from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addUpdateUserRights = async (req: Request, res: Response) => {
  const payload: userRightsDto = req.body;
  const userId = payload.isEdited ? payload.editedBy_userId : payload.createdBy_userId;
  const isEditMode = !!payload.isEdited;

  try {
    // ✅ Validate payload
    const validation = userRightsValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    const userRightsRepo = appSource.getRepository(userRights);

    // ✅ Check if an existing record already exists for same userType + company
    const existingDetails = await userRightsRepo.findOneBy({
      userTypeId: payload.userTypeId,
      companyId: payload.companyId,
    });

    // ✅ Preserve old createdBy_userId if updating
    let createdBy = payload.createdBy_userId;
    if (existingDetails && existingDetails.createdBy_userId) {
      createdBy = existingDetails.createdBy_userId;
    }

    // ✅ Delete old rights before inserting new (to prevent duplicates)
    await userRightsRepo.delete({
      userTypeId: payload.userTypeId,
      companyId: payload.companyId,
    });

    // ✅ Prepare new records to insert
    const rightsToInsert: userRightsDto[] = [];
    for (const moduleName in payload.selectedForms) {
      const forms = payload.selectedForms[moduleName];
      if (Array.isArray(forms)) {
        forms.forEach((form: any) => {
          rightsToInsert.push({
            userTypeId: payload.userTypeId,
            companyId: payload.companyId,
            createdBy_userId: createdBy,
            editedBy_userId: isEditMode ? payload.editedBy_userId : null,
            selectedForms: {},
            formCode: form.formCode,
            formName: form.formName,
            parentId: form.parentId,
          });
        });
      }
    }

    if (rightsToInsert.length === 0) {
      return res.status(400).json({ message: "No forms selected to save." });
    }

    // ✅ Save new records
    await userRightsRepo.save(rightsToInsert);

    // ✅ Prepare and insert log
    if (existingDetails) {
      // update log
      const updatedFields: string = await getChangedPropertyUserRights([payload], [existingDetails]);
      await InsertLog({
        userId,
        userName: null,
        statusCode: "200",
        message: `User Rights Updated Changes - ${updatedFields} By User -`,
        companyId: payload.companyId,
      });

      return res.status(200).send({ IsSuccess: "User Rights Updated Successfully" });
    } else {
      // new insert log
      await InsertLog({
        userId,
        userName: null,
        statusCode: "200",
        message: `User Rights Added By User -`,
        companyId: payload.companyId,
      });

      return res.status(200).send({ IsSuccess: "User Rights Added Successfully" });
    }
  } catch (error: any) {
    // ✅ Log error
    const logsPayload: logsDto = {
      userId: payload.createdBy_userId || payload.editedBy_userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding/Updating User Rights - ${error.message} By User -`,
      companyId: payload.companyId,
    };
    await InsertLog(logsPayload);

    if (error instanceof ValidationException) {
      return res.status(400).send({ message: error.message });
    }

    res.status(500).send({ message: error.message });
  }
};


export const getUserRights = async(req: Request , res : Response) => {
    try{
        const {companyId , userTypeId} = req.params;
        const userRightsRepo = appSource.getRepository(userRights);

        const userRightsList = await userRightsRepo.findBy({
            companyId : companyId,
            userTypeId : userTypeId
        });

        res.status(200).send({
            Result: userRightsList,
        });
        
    }catch(error){
        if (error instanceof ValidationException) {
            return res.status(400).send({
                message: error?.message,
            });
        }
        res.status(500).send(error?.message);
    }
}




