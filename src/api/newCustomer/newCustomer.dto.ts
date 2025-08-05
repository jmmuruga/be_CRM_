import Joi from "joi";

export const newCustomerDetailsValidation = Joi.object({
  customerName: Joi.string().required(),
  mobile:Joi.string().required(),
  location: Joi.string().required(),
  district: Joi.string().required(),
});
