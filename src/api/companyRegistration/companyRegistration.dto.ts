import Joi from "joi";

export const companyRegistrationValidation = Joi.object({
    companyName: Joi.string().required(),
    Mobile: Joi.string().required(),
    companyStart: Joi.string().required(),
    Location: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    branchLocation: Joi.string().required(),
    ownerName: Joi.string().required(),

})