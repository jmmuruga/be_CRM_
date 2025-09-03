import Joi from "joi";

export const signInValidation = Joi.object({
    userName: Joi.string().required(),
     Password: Joi.string().required(),

})

export interface signInDto {
    userName: string;
    Password: string;
}