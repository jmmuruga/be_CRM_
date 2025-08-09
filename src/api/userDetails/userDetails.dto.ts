import Joi from "joi";

export const userDetailsValidation = Joi.object({
  userName: Joi.string().required(),
  userId: Joi.string().required(),
  Email: Joi.string().required(),
  userType: Joi.string().required(),
  Mobile: Joi.string().required(),
  Password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

export interface userDetailsDto {
  userName: string;
  userId: string;
  Email: string;
  userType: string;
  Mobile: string;
  Password: string;
  confirmPassword: string;
}


export interface userDetailsStatus{
  userId: string;
  status: boolean;
}