import Joi from "joi";

export const serviceProviderMasterValidation = Joi.object({
    serviceProviderName:Joi.string().required(),
    website:Joi.string().required(),
    contactNumber:Joi.string().required(),
    tollFreeNumber:Joi.string().required(),
    Address:Joi.string().required(),



})