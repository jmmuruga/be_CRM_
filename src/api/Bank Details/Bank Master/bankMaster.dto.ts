import Joi from "joi";

export const bankMasterValidation = Joi.object({
  bankNameId: Joi.string().required(),
  bankFullName: Joi.string().required(),
  bankShortName: Joi.string().required(),
  branchLocation: Joi.string().required(),
  ifscCode: Joi.string().required(),
  branchPhone: Joi.string().required(),
  branchManagerName: Joi.string().required(),
  branchManagerPhone: Joi.string().required(),
  companyId: Joi.string().required(),
  Address: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface bankMasterDto {
  bankNameId: string;
  bankFullName: string;
  bankShortName: string;
  branchLocation: string;
  ifscCode: string;
  branchPhone: string;
  branchManagerName: string;
  branchManagerPhone: string;
  companyId: string;
  Address: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}

export interface bankMasterStatus{
  bankNameId: string;
  companyId: string;
  status: boolean;
  userId: string;
}
