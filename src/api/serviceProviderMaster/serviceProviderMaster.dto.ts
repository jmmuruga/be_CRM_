import Joi from "joi";

export const serviceProviderMasterValidation = Joi.object({
    serviceProviderId:Joi.string().required(),
    serviceProviderName:Joi.string().required(),
    website: Joi.string().optional().allow(null, ""),
    contactNumber:Joi.string().required(),
    tollFreeNumber:Joi.string().required(),
    Address:Joi.string().required(),
    companyId: Joi.string().required(),
    
})

export interface serviceProviderMaster{
    serviceProviderId:string;
    serviceProviderName:string;
    website:string;
    contactNumber:string;
    tollFreeNumber:string;
    Address:string;
    companyId: string;
    
}