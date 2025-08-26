import Joi from "joi";

export const serverMasterValidation = Joi.object({
  serverPlanId: Joi.string().required(),
  serviceProvider: Joi.string().required(),
  serverPlan: Joi.string().required(),
  ipAddress: Joi.string().optional().allow(null, ""),
  supportPin: Joi.string().optional().allow(null, ""),
  domainName: Joi.string().required(),
  emailAddress: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().required(),
  registrationDate: Joi.string().required(),
  expiryDate: Joi.string().required(),
  companyId: Joi.string().required(),
});

export interface severMasterDto{
  serverPlanId:string;
  serviceProvider:string;
  serverPlan:string;
  ipAddress:string;
  supportPin:string;
  domainName:string;
  emailAddress:string;
  userName:string;
  password:string;
  registrationDate:string;
  expiryDate:string;
  companyId:string;

}


