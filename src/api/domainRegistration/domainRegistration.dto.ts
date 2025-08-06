import Joi, { string } from "joi";

export const domainRegistrationValidation = Joi.object({
  domainNameId: Joi.string().required(),
  domainName: Joi.string().required(),
  registrationDate: Joi.string().required(),
  expiryDate: Joi.string().required(),
  ssl: Joi.boolean().required(),
});

export interface domainRegistrationDto {
  domainNameId: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  ssl: boolean;
}
