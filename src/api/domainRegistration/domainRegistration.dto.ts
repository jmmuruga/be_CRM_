import Joi, { string } from "joi";

export const domainRegistrationValidation = Joi.object({
  domainNameId: Joi.string().required(),
  domainName: Joi.string().required(),
  registrationDate: Joi.string().required(),
  expiryDate: Joi.string().required(),
  ssl: Joi.boolean().required(),
  companyId: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),

});

export interface domainRegistrationDto {
  domainNameId: string;
  companyId: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  ssl: boolean;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}


export interface domainRegistrationStatus {
  domainNameId : string;
  status : boolean;
  companyId: string;
  userId: string;
}