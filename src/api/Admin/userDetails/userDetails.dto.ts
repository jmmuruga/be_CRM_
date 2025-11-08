import Joi from "joi";

export const userDetailsValidation = Joi.object({
  userName: Joi.string().required(),
  userId: Joi.string().required(),
  Email: Joi.string().required(),
  userType: Joi.string().required(),
  Mobile: Joi.string().required(),
  Password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
  companyId: Joi.string().optional().allow(null, ""),
});

export interface userDetailsDto {
  userName: string;
  userId: string;
  Email: string;
  userType: string;
  Mobile: string;
  Password: string;
  confirmPassword: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
  companyId?: string;
}

export interface userDetailsStatusDto {
  userId: string;
  status: boolean;
  companyId: string;
  satusUpdatedUser: string;
}

export interface resetUserPasswordDto {
  userId: string;
  Email: boolean;
  Password: string;
  confirmPassword: string;
}

export const resetUserPasswordValidation = Joi.object({
  userId: Joi.string().required(),
  Email: Joi.string().required(),
  Password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});
