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
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface serverMasterDto {
  serverPlanId: string;
  serviceProvider: string;
  serverPlan: string;
  ipAddress: string;
  supportPin: string;
  domainName: string;
  emailAddress: string;
  userName: string;
  password: string;
  registrationDate: string;
  expiryDate: string;
  companyId: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}

export interface serverMasterStatus {
  companyId: string;
  serverPlanId: string;
  status: boolean;
  userId: string;
}
