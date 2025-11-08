import Joi from "joi";

export const hostingMasterValidation = Joi.object({
  hostingId: Joi.string().required(),
  customerName: Joi.string().required(),
  server: Joi.string().required(),
  domainName: Joi.string().required(),
  hostingName: Joi.string().required(),
  registrationDate: Joi.string().isoDate().required(),
  expiryDate: Joi.string().isoDate().required(),
  companyId: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  isEdited: Joi.boolean().optional(),
  editedBy_userId: Joi.string().optional().allow(null, ""),
});

export interface hostingMasterDto {
  hostingId: string;
  customerName: string;
  server: string;
  domainName: string;
  hostingName: string;
  registrationDate: string;
  expiryDate: string;
  companyId: string;
  createdBy_userId: string;
  isEdited: boolean;
  editedBy_userId: string;
}

export interface hostingMasterStatus{
    hostingId: string;
    status:boolean;
    companyId: string;
    userId: string;


}
