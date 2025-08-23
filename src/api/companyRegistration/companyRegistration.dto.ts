import Joi from "joi";

export const companyRegistrationValidation = Joi.object({
  companyId: Joi.string().required(),
  companyStartDate: Joi.string().required(),
  companyName: Joi.string().required(),
  doorNumber: Joi.string().required(),
  buildingName: Joi.string().required(),
  Street: Joi.string().required(),
  Email: Joi.string().required(),
  Location: Joi.string().required(),
  pinCode: Joi.string().required(),
  Post: Joi.string().required(),
  Taluk: Joi.string().required(),
  District: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  licenseDate: Joi.string().required(),
  Thasildhar: Joi.string().required(),
  Website:Joi.string().optional().allow(null, ""),
  ownerName: Joi.string().required(),
  Mobile: Joi.string().required(),
  officeNumber: Joi.string().required(),
  Branch: Joi.string().required(),
  branchMobile: Joi.string().optional().allow(null, ""),
  companyImage: Joi.string().optional().allow(null, ""),
});


export interface companyRegistrationDto{
  companyId: string,
  companyStartDate: string,
  companyName: string,
  doorNumber: string,
  buildingName: string,
  Street: string,
  Email: string,
  Location: string,
  pinCode: string,
  Post: string,
  Taluk: string,
  District: string,
  licenseNumber: string,
  licenseDate: string,
  Thasildhar: string,
  Website: string,
  ownerName: string,
  Mobile: string,
  officeNumber: string,
  Branch: string,
  branchMobile: string,
  companyImage:string,
}


export interface companyDetailsStatus{
  companyId: string;
  status: boolean;
}