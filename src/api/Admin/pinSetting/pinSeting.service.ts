import { Request, Response } from "express";
import { pinSettingDto, pinSettingValidation } from "./pinSeting.dto";
import { decrypter, encryptString } from "../userDetails/userDetails.service";
import { pinSetting } from "./pinSeting.model";
import { appSource } from "../../../core/dataBase/db";
import { ValidationException } from "../../../core/exception";
import { getChangedProperty } from "../../../shared/helper";
import { logsDto } from "../logs/logs.dto";
import { InsertLog } from "../logs/logs.service";

export const addUpdatePinSetting = async (req: Request, res: Response) => {
  const payload: pinSettingDto = req.body;
  const userId = payload.isEdited
    ? payload.editedBy_userId
    : payload.createdBy_userId;
  const companyId = payload.companyId;
  const validation = pinSettingValidation.validate(payload);
  try {
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }
    const { addPin, editPin, deletePin } = payload;
    if (addPin === editPin || addPin === deletePin || editPin === deletePin) {
      return res.status(400).send({
        message: "Add, Edit, and Delete Pin, All Must Be Different.",
      });
    }
    const otpPinRepostory = appSource.getRepository(pinSetting);
    if (payload.addPin) {
      payload.addPin = encryptString(payload.addPin, "ABCXY123");
    }
    if (payload.editPin) {
      payload.editPin = encryptString(payload.editPin, "ABCXY123");
    }
    if (payload.deletePin) {
      payload.deletePin = encryptString(payload.deletePin, "ABCXY123");
    }
    const existingDetails = await otpPinRepostory.findOneBy({
      pinId: payload.pinId,
      companyId: payload.companyId,
    });
    if (existingDetails) {
      payload.editedBy_userId = payload.editedBy_userId || userId;
    }
    if (existingDetails) {
      await otpPinRepostory
        .update({ pinId: payload.pinId, companyId: payload.companyId }, payload)
        .then(async () => {
          const updatedFields: string = await getChangedProperty(
            [payload],
            [existingDetails]
          );
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "200",
            message: `Pin Setting Updated For CompanyID "${payload.companyId}" Updated - Changes ${updatedFields} By User - `,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(200).send({
            IsSuccess: "OTP Pin Setting Updated Successfully",
          });
        })
        .catch(async (error) => {
          const logsPayload: logsDto = {
            userId: userId,
            userName: null,
            statusCode: "400",
            message: `Error While Updating Pin Settings For "${payload.companyId}" - ${error.message} By User -`,
            companyId: companyId,
          };
          await InsertLog(logsPayload);
          res.status(500).send(error.message);
        });
    } else {
      payload.createdBy_userId = userId;
      payload.editedBy_userId = null;
      await otpPinRepostory.save(payload);
      const logsPayload: logsDto = {
        userId: userId,
        userName: null,
        statusCode: "200",
        message: ` Pin Setting For "${payload.companyId}"  Added By User -`,
        companyId: companyId,
      };
      await InsertLog(logsPayload);
      res.status(200).send({
        IsSuccess: " Pin Saved Successfully",
      });
    }
  } catch (error) {
    const logsPayload: logsDto = {
      userId: userId,
      userName: null,
      statusCode: "400",
      message: `Error While Adding Pin Setting For "${payload.companyId}" By User -`,
      companyId: companyId,
    };
    await InsertLog(logsPayload);
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }
    res.status(500).send(error.message);
  }
};

export const getPinSettingDetails = async (req: Request, res: Response) => {
  try {
    const companyId = req.params.companyId;
    const pinSetingRepositry = appSource.getRepository(pinSetting);
    const pinSeting = await pinSetingRepositry.createQueryBuilder("").where({ companyId: companyId }).getMany();
    pinSeting.forEach((x) => {
          x.addPin = decrypter(x.addPin) || x.addPin;
          x.editPin = decrypter(x.editPin) || x.editPin;
          x.deletePin = decrypter(x.deletePin) || x.deletePin;
        });
    res.status(200).send({
      Result: pinSeting,
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
