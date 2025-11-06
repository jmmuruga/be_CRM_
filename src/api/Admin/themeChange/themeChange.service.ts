import { Request, Response } from "express";
import { CustomizeThemeDto, customizeThemeValidation } from "./themeChange.dto";
import { appSource } from "../../../core/dataBase/db";
import { customizeTheme } from "./themeChange.model";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addUpdateCustomizeTheme = async (req: Request, res: Response) => {
  const payload: CustomizeThemeDto = req.body;
  const userId = payload.isEdited ? payload.editedBy_userId : payload.userId;
  const companyId = payload.companyId;
  try {
    const validation = customizeThemeValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const themeRepository = appSource.getRepository(customizeTheme);
    const existingDetails = await themeRepository.findOneBy({
      companyId: payload.companyId,
      userId: payload.userId,
    });
    if (existingDetails) {
      payload.isEdited = true;
      payload.editedBy_userId = payload.userId;
      await themeRepository
        .update(
          { companyId: payload.companyId, userId: payload.userId },
          payload
        )
        .then(async () => {
          let updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Theme Customization Updated - Changes : ${updatedFields} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);

          return res.status(200).send({
            IsSuccess: true,
            Message: "Theme Updated successfully !",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Theme Customization - ${error.message} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          if (error instanceof ValidationException) {
            return res.status(400).send({
              message: error?.message,
            });
          }
        });
      return;
    } else {
      await themeRepository.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: `Theme Customization Added Successfully By User - `,
        companyId: companyId,
      };
      await InsertLog(logsPayload);

      return res.status(200).send({
        IsSuccess: true,
        Message: "Theme Customized Successfully !",
      });
    }
  } catch (error: any) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Theme Customization Details- ${error.message} By User - `,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        IsSuccess: false,
        ErrorMessage: error?.message,
      });
    }
    res.status(500).send({
      IsSuccess: false,
      ErrorMessage: error.message || "Internal Server Error",
    });
    return;
  }
};

export const getCustomizedTheme = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const companyId = req.params.companyId;
  try {
    const themeRepository = appSource.getRepository(customizeTheme);
    const customizedThemeDetails = await themeRepository
      .createQueryBuilder()
      .where({ companyId: companyId, userId: userId })
      .getMany();
    res.status(200).send({
      Result: customizedThemeDetails,
    });
  } catch (error: any) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        ErrorMessage: error?.message,
      });
    }
    res.status(500).send(error);
  }
};
