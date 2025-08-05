import Joi from "joi";

export const hostingMasterValidation = Joi.object({
    customerName:Joi.string().required(),
    server:Joi.string().required(),
    domainName:Joi.string().required(),
    hostingName:Joi.string().required(),
    registratoinDate:Joi.string().required(),
    expiryDate:Joi.string().required(),

})