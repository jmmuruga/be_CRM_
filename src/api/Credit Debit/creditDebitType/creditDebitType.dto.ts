import Joi from "joi";


export const creditDebitTypeValidation = Joi.object({
    creditDebitId : Joi.string().required(),
    creditDebitName : Joi.string().required(),
    Mobile : Joi.string().optional().allow(null, ""),
    Remarks : Joi.string().optional().allow(null, ""),
    createdBy_userId : Joi.string().required(),
    isEdited : Joi.boolean().optional(),
    editedBy_userId : Joi.string().optional().allow(null, ""),
    companyId: Joi.string().required(),
});

export interface CreditDebitTypeDTO {
    creditDebitId: string;
    creditDebitName: string;
    Mobile: string ;
    Remarks: string ;
    createdBy_userId: string;
    isEdited?: boolean;
    editedBy_userId?: string;
    companyId?: string;
}

export interface creditDebitTypeStatus {
    creditDebitId: string;
    status: boolean;
    userId: string;
    companyId : string;
}