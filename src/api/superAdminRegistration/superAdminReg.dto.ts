import Joi from "joi";

export const superAdminRegistrationValidation = Joi.object({
  userName: Joi.string().required(),
  userId: Joi.string().required(),
  Email: Joi.string().required(),
  userType: Joi.string().required(),
  Mobile: Joi.string().required(),
  Password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  createdBy_userId : Joi.string().required(),
  companyId : Joi.string().optional().allow(null, ""),

});

export interface superAdminRegistrationDto {
  userName: string;
  userId: string;
  Email: string;
  userType: string;
  Mobile: string;
  Password: string;
  confirmPassword: string;
  createdBy_userId: string;
  companyId:string;

}
