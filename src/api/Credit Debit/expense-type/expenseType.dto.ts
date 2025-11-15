import Joi from "joi";

export const expenseTypeValidation = Joi.object({
    expenseTypeId: Joi.string().required(),
    expenseTypeName: Joi.string().required(),
    createdBy_userId: Joi.string().required(),
    isEdited: Joi.boolean().optional(),
    editedBy_userId : Joi.string().optional().allow(null, ""),
    companyId : Joi.string().optional().allow(null, "")
});

export interface expenseTypeDTO {
    expenseTypeId: string;
    expenseTypeName: string;
    createdBy_userId: string;
    isEdited?: boolean;
    editedBy_userId?: string;
    companyId?: string;
}

export interface expenseTypeStatus {
    expenseTypeId: string;
    status: boolean;
    userId: string;
    companyId : string;
}