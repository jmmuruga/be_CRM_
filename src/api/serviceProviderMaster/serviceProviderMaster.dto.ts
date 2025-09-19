import Joi from "joi";

export const serviceProviderMasterValidation = Joi.object({
  serviceProviderId: Joi.string().required(),
  serviceProviderName: Joi.string().required(),
  Website: Joi.string().optional().allow(null, ""),
  contactNumber: Joi.string().required(),
  tollFreeNumber: Joi.string().required(),
  Address: Joi.string().required(),
  companyId: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface serviceProviderMasterDto {
  serviceProviderId: string;
  serviceProviderName: string;
  Website: string;
  contactNumber: string;
  tollFreeNumber: string;
  Address: string;
  companyId: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}

export interface serviceProviderMasterStatus {
  serviceProviderId: string;
  companyId: string;
  status: boolean;
  userId: string;
}
