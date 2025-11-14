import Joi from "joi";


export const creditDebitValidation = Joi.object({
    creditDebitId : Joi.string().required(),
    creditDebitName : Joi.string().required(),
    Mobile : Joi.string().optional().allow(null, ""),
    Remarks : Joi.string().optional().allow(null, ""),
    createdBy_userId : Joi.string().required(),
    isEdited : Joi.boolean().optional(),
    editedBy_userId : Joi.string().optional().allow(null, ""),
});

export interface CreditDebitDTO {
    creditDebitId: string;
    creditDebitName: string;
    Mobile: string ;
    Remarks: string ;
    createdBy_userId: string;
    isEdited?: boolean;
    editedBy_userId?: string;
}