import Joi from "joi";

export const customizeThemeValidation  = Joi.object({
    // themeId: Joi.string().required(),
    companyId: Joi.string().required(),
    userId: Joi.string().required(),
    themeColor: Joi.string().required(),
    tableHeaderColor: Joi.string().required(),
    tableHeaderTextColor: Joi.string().required(),
    isEdited: Joi.boolean().optional(),
    editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface CustomizeThemeDto {
    // themeId: string;
    companyId: string;
    userId: string;
    themeColor?: string;
    tableHeaderColor?: string;
    tableHeaderTextColor?: string;
    isEdited: boolean;
    editedBy_userId?: string;
}