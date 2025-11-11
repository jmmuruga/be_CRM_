import Joi from "joi";

// export const userRightsValidation = Joi.object({
//   userTypeId: Joi.string().required(),
//   companyId: Joi.string().required(),
//   formCode: Joi.string().required(),
//   parentId: Joi.string().required(),
//   formName: Joi.string().required(),
//   createdBy_userId: Joi.string().required(),
//   isEdited: Joi.boolean().optional(),
//   editedBy_userId: Joi.string().optional().allow(null, ""),
// });



export const userRightsValidation = Joi.object({
  userTypeId: Joi.string().required(),
  companyId: Joi.string().required(),
  createdBy_userId: Joi.string().required(),
  selectedForms: Joi.object()
    .pattern(
      Joi.string(), // module name like 'Admin', 'Master'
      Joi.array().items(
        Joi.object({
          formName: Joi.string().required(),
          formCode: Joi.string().required(),
          parentId: Joi.string().required(),
        })
      )
    )
    .required(),
});



// export interface userRightsDto {
//   userTypeId: string;
//   companyId: string;
//   formCode: string;
//   parentId: string;
//   formName: string;
//   createdBy_userId: string;
//   isEdited?: boolean;
//   editedBy_userId?: string;
// }

export interface userRightsDto {
  userTypeId: string;
  companyId: string;
  formCode: string;
  parentId: string;
  formName: string;
  createdBy_userId: string;
  isEdited?: boolean;
  editedBy_userId?: string;
  selectedForms?: {
    [key: string]: { formName: string; formCode: string }[];
  };
}



