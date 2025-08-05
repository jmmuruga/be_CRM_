import Joi from "joi";

export const serverMasterValidation = Joi.object({
  serviceProvider: Joi.string().required(),
  serverPlan: Joi.string().required(),
  domainName: Joi.string().required(),
  emailAddress: Joi.string().required(),
  userName: Joi.string().required(),
  registrationDate: Joi.string().required(),
  expiryDate: Joi.string().required(),
});
