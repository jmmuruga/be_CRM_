import Joi from "joi";

export const domainMasterValidation = Joi.object({
  domainMasterId: Joi.string().required(),
  companyId: Joi.string().required(),
  serviceProvider: Joi.string().required(),
  serverPlan: Joi.string().required(),
  domainName: Joi.string().required(),
  registrationDate: Joi.string().required(),
  expiryDate: Joi.string().required(),
  customerName: Joi.string().required(),
  domainCost: Joi.string().required(),
  paymentStatus: Joi.string().valid("Paid", "Unpaid").required(),
  paymentMethod: Joi.when("paymentStatus", { is: "Paid",
    then: Joi.string().valid("Cash", "Online Payment").required(),
    otherwise: Joi.string().allow("",null).optional()}),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface domainMasterDto {
  domainMasterId:string;
  companyId: string;
  serviceProvider: string;
  serverPlan: string;
  domainName: string;
  registrationDate: string;
  expiryDate: string;
  customerName: string;
  domainCost: string;
  paymentStatus: string;
  paymentMethod ? :string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}

export interface domainMasterStatus{
  domainMasterId:string;
  companyId: string;
  status:boolean;
  userId: string;

}
