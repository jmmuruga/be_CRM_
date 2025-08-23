import Joi from "joi";

export const hostingMasterValidation = Joi.object({
  hostingId: Joi.string().required(),
  customerName: Joi.string().required(),
  server: Joi.string().required(),
  domainName: Joi.string().required(),
  hostingName: Joi.string().required(),
  registrationDate: Joi.string().isoDate().required(),
  expiryDate: Joi.string().isoDate().required(),
  companyId: Joi.string().required(),
});

export interface hostingMasterDto {
  hostingId: string;
  customerName: string;
  server: string;
  domainName: string;
  hostingName: string;
  registrationDate: string;
  expiryDate: string;
  companyId: string;
}
