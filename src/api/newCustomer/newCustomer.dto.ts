import Joi from "joi";

export const newCustomerRegistrationValidation = Joi.object({
  customerId: Joi.string().required(),
  customerName: Joi.string().required(),
  Email:  Joi.string().required(),
  Mobile:Joi.string().required(),
  alterMobile: Joi.string().required(),
  whatsappNumber: Joi.string().optional().allow(null, ""),
  Location: Joi.string().required(),
  District: Joi.string().required(),
  Post : Joi.string().required(),
  Taluk: Joi.string().required(),
  pinCode: Joi.string().required(),
  doorNumber:Joi.string().required(),
  Street: Joi.string().required(),
  landMark : Joi.string().required(),
  companyName : Joi.string().required(),

});

export interface newCustomerRegistrationDto{

  customerId:string;
  customerName:string;
  Email: string;
  Mobile:string;
  alterMobile:string;
  whatsappNumber: string;
  Location:string;
  District:string;
  Post :string;
  Taluk:string;
  pinCode:string;
  doorNumber:string;
  Street:string;
  landMark :string;
  companyName :string;

}

export interface customerDetailsStatus{
  customerId: string;
  status: boolean;
}