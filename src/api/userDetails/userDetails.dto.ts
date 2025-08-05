import Joi from "joi";

export const userDetailsValidation = Joi.object({
    userName:Joi.string().required(),
    Email:Joi.string().required(),
    userType:Joi.string().required(),
    Mobile:Joi.string().required(),
})