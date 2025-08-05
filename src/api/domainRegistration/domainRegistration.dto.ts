import Joi, { string } from "joi";

export const domainRegistrationValidation = Joi.object({
    domainName:Joi.string().required(),
    registrationDate:Joi.string().required(),
    expiryDate:Joi.string().required(),
    ssl:Joi.string().required(),
    
})