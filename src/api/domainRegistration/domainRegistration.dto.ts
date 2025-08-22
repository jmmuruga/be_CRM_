import Joi, { string } from "joi";

export const domainRegistrationValidation = Joi.object({
  domainNameId: Joi.string().required(),
  domainName: Joi.string().required(),
  registrationDate: Joi.string().required(),
  expiryDate: Joi.string().required(),
  ssl: Joi.boolean().required(),
  companyId: Joi.string().required(),

});

export interface domainRegistrationDto {
  domainNameId: string;
  companyId: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  ssl: boolean;
}


export interface domainRegistrationStatus {
  domainNameId : string;
  status : boolean;
  companyId: string;
}