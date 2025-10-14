import Joi from "joi";

export const pinSettingValidation = Joi.object({
    addPin : Joi.string().required(),
    editPin : Joi.string().required(),
    deletePin : Joi.string().required(),
    createdBy_userId: Joi.string().required(),
    isEdited: Joi.boolean().optional(),
    editedBy_userId: Joi.string().optional().allow(null, ""),
    companyId: Joi.string().optional().allow(null, ""),
    pinId : Joi.string().required(),
    

});


export interface pinSettingDto {
    addPin :  string;
    editPin :  string;
    deletePin :  string;
    createdBy_userId:  string;
    isEdited:  boolean;
    editedBy_userId:  string;
    companyId?: string;
    pinId : string;
}