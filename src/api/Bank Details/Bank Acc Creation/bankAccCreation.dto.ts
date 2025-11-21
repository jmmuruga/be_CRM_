import Joi from "joi";

export const bankAccountCreationValidation = Joi.object({

  bankAccNumberCreationId: Joi.string().required(),
  accountHolderName: Joi.string().required(),
  bankAccountNumber: Joi.string().required(),
  confirmBankAccountNumber: Joi.string().required(),
  Bank: Joi.string().required(),
  Branch: Joi.string().required(),
  ifscCode: Joi.string().required(),
  accountType: Joi.string().required(),
  authorizedPersonName: Joi.string().required(),
  registeredMobileNumber: Joi.string().required(),
  openingBalanceAmount: Joi.string().required(),
  asOnDate: Joi.string().required(),
  status: Joi.boolean().optional(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface bankAccountCreationDto {
  bankAccNumberCreationId: string;
  accountHolderName: string;
  bankAccountNumber: string;
  confirmBankAccountNumber: string;
  Bank: string;
  Branch: string;
  ifscCode: string;
  accountType: string;
  authorizedPersonName: string;
  registeredMobileNumber: string;
  openingBalanceAmount: string;
  asOnDate: string;
  status: boolean;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}
