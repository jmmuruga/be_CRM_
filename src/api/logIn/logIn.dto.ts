import Joi from "joi";

export const logInValidation = Joi.object({
  userName: Joi.string().required(),
  Password: Joi.string().required(),
});

export interface logInDto {
  userName: string;
  Password: string;
}

export interface logOutDto {
  userId: string;
  companyId:string;
  islogout:boolean;
}
