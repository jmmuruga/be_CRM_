import Joi from "joi";

export const creditDebitValidation = Joi.object({
  receiptId: Joi.string().required(),
  Date: Joi.string().required(),
  accountType: Joi.string().required(),
  creditDebitType: Joi.string().required(),
  Credit: Joi.string().required(),
  Debit: Joi.string().required(),
  Details: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
  companyId: Joi.string().required(),
});


export interface CreditDebitDTO {
  receiptId: string;
  Date: string;
  accountType: string;
  creditDebitType: string;
  Credit: string;
  Debit: string;
  Details: string;
  paymentMethod: string;
  createdBy_userId: string;
  isEdited?: boolean;
  editedBy_userId?: string;
  companyId?: string;
}