import Joi from "joi";

export const userDetailsValidation = Joi.object({
  userName: Joi.string().required(),
  userNameId: Joi.string().required(),
  Email: Joi.string().required(),
  userType: Joi.string().required(),
  Mobile: Joi.string().required(),
  password: Joi.string().required(),
  confirmpassword: Joi.string().required(),
});

export interface userDetailsDto {
  userName: string;
  userNameId: string;
  Email: string;
  userType: string;
  Mobile: string;
  password: string;
  confirmpassword: string;
}
