import Joi from "joi";

export const domainMasterValidation = Joi.object({
    serviceProviderId:Joi.string().required(),
    serviceProvider:Joi.string().required(),
    serverPlan:Joi.string().required(),
    domainName:Joi.string().required(),
    registrationDate:Joi.string().required(),
    expiryDate:Joi.string().required(),
    customerName:Joi.string().required(),

})


export interface domainMasterDto {
  serviceProviderId: string;
  serviceProvider: string;
  serverPlan: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  customerName: string;
}

