import Joi from "joi";

export const paymentTypeValidation = Joi.object({
  paymentTypeId: Joi.string().required(),
  paymentTypeName: Joi.string().required(),
  companyId: Joi.string().required(),
  Mobile: Joi.string().required(),
  linkedAccountNumber: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});


export interface PaymentTypeDTO {
  paymentTypeId: string;
  paymentTypeName: string;
  companyId: string;
  Mobile: string;
  linkedAccountNumber: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}
