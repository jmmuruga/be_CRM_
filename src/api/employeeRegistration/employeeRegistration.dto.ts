import Joi from "joi";

export const employeeRegistrationValidation = Joi.object({
    employeeName: Joi.string().required(),
    employeeMobile: Joi.string().required(),
    gender: Joi.string().required(),
    joiningDate: Joi.string().required(),
    designation: Joi.string().required(),
})