import { Request, Response } from "express";
import { appSource } from "../../../core/dataBase/db";
import { userRights } from "./userRights.model";
import { userRightsDto, userRightsValidation } from "./userRights.dto";
import { ValidationException } from "../../../core/exception";

export const addUpdateUserRights = async (req: Request, res: Response) => {
  const payload: userRightsDto = req.body;
  const userRightsRepo = appSource.getRepository(userRights);

  try {
    const validation = userRightsValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    // Delete old rights for same userType and company
    await userRightsRepo.delete({
      userTypeId: payload.userTypeId,
      companyId: payload.companyId,
    });

    const rightsToInsert: userRightsDto[] = [];

    // ✅ Loop through each module (Admin, Master, etc.)
    for (const moduleName in payload.selectedForms) {
      const forms = payload.selectedForms[moduleName];

      if (Array.isArray(forms)) {
        forms.forEach((form: any) => {
          rightsToInsert.push({
            userTypeId: payload.userTypeId,
            companyId: payload.companyId,
            createdBy_userId: payload.createdBy_userId,
            selectedForms: {}, // not stored per record, only used in request
            formCode: form.formCode,
            formName: form.formName,
            parentId: form.parentId, // ✅ actual parentId from frontend
          });
        });
      }
    }

    // ✅ Save to DB
    if (rightsToInsert.length > 0) {
      await userRightsRepo.save(rightsToInsert);
    } else {
      return res.status(400).json({ message: "No forms selected to save." });
    }

    res.status(200).send({
      IsSuccess: "User Rights Added  Successfully",
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
