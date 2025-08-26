import Joi from "joi";

export const serviceProviderMasterValidation = Joi.object({
  serviceProviderId: Joi.string().required(),
  serviceProviderName: Joi.string().required(),
  Website: Joi.string().optional().allow(null, ""),
  contactNumber: Joi.string().required(),
  tollFreeNumber: Joi.string().required(),
  Address: Joi.string().required(),
  companyId: Joi.string().required(),
});

export interface serviceProviderMasterDto {
  serviceProviderId: string;
  serviceProviderName: string;
  Website: string;
  contactNumber: string;
  tollFreeNumber: string;
  Address: string;
  companyId: string;
}

export interface serviceProviderMasterStatus {
  serviceProviderId: string;
  companyId: string;
  status: boolean;
}
