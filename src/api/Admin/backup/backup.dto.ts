import Joi from "joi";

export const backupSettingValidation = Joi.object({
  backupId: Joi.string().required(),
  backupDrive: Joi.string().required(),
  showBackup: Joi.boolean(),
  Daily: Joi.boolean().optional().allow(null, ""),
  Weekly: Joi.boolean().optional().allow(null, ""),
  Monthly: Joi.boolean().optional().allow(null, ""),
  dailyTime: Joi.string().optional().allow(null, ""),
  weeklyDay: Joi.string().optional().allow(null, ""),
  weeklyTime: Joi.string().optional().allow(null, ""),
  monthlyDate: Joi.string().optional().allow(null, ""),
  monthlyTime: Joi.string().optional().allow(null, ""),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface backupSettingDto {
  backupId: string;
  backupDrive: string;
  showBackup: boolean;
  Daily: boolean;
  Weekly: boolean;
  Monthly: boolean;
  dailyTime: string;
  weeklyDay: string;
  weeklyTime: string;
  monthlyDate: string;
  monthlyTime: string;
  createdBy_userId: string;
  isEdited?: boolean;
  editedBy_userId?: string;
}
