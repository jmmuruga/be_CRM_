import Joi from "joi";

export const employeeRegistrationValidation = Joi.object({
    employeeId: Joi.string().required(),
    employeeName: Joi.string().required(),
    gender: Joi.string().required(),
    employeeMobile: Joi.string().required(),
    employeeEmail: Joi.string().required(),
    bloodGroup: Joi.string().required(),
    guardianType:Joi.string().required(),
    guardianName:Joi.string().required(),
    guardianMobile:Joi.string().required(),
    joiningDate: Joi.string().required(),
    dob:Joi.string().required(),
    resignedDate:Joi.string().required(),
    designation: Joi.string().required(),
    monthlySalary:Joi.string().required(),
    employeeAddress:Joi.string().required(),
    emplpoyeeImage: Joi.string().optional().allow(null,""),
    
});


export interface employeeRegistrationDetails{
    employeeId:string;
    employeeName: string;
    gender: string;
    employeeMobile: string;
    employeeEmail: string;
    bloodGroup: string;
    guardianType:string;
    guardianName:string;
    guardianMobile:string;
    joiningDate: string;
    dob:string;
    resignedDate:string;
    designation: string;
    monthlySalary:string;
    employeeAddress:string;
    emplpoyeeImage: string;

}