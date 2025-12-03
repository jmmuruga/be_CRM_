import Joi from "joi";

export const expenseDetailsValidation = Joi.object({
  debitId: Joi.string().required(),
  Date: Joi.string().required(),
  expenseType: Joi.string().required(),
  Details: Joi.string().required(),
  Credit: Joi.string().required(),
  Debit: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
  companyId: Joi.string().required(),
});

export interface expenseDetailsDTO {
  debitId: string;
  Date: string;
  expenseType: string;
  Details: string;
  Credit: string;
  Debit: string;
  paymentMethod: string;
  createdBy_userId: string;
  isEdited?: boolean;
  editedBy_userId?: string;
  companyId?: string;
}
