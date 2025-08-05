import Joi from "joi";

export const domainMasterValidation = Joi.object({
    serviceProvider:Joi.string().required(),
    serverPlan:Joi.string().required(),
    domainName:Joi.string().required(),
    registrationDate:Joi.string().required(),
    expiryDate:Joi.string().required(),
    customerName:Joi.string().required(),

})
