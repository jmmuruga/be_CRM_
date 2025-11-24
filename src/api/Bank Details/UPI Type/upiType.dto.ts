import Joi from "joi";

export const upiTypeValidation = Joi.object({
  upiTypeId: Joi.string().required(),
  upiTypeName: Joi.string().required(),
  companyId: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface UpiTypeDTO {
  upiTypeId: string;
  upiTypeName: string;
  companyId: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}

export interface upiTypeStatus{
  upiTypeId: string;
  companyId: string;
  status: boolean;
  userId: string;
}