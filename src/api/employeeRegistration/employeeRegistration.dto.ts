import Joi from "joi";

export const employeeRegistrationValidation = Joi.object({
    employeeId: Joi.string().required(),
    employeeName: Joi.string().required(),
    Gender: Joi.string().required(),
    employeeMobile: Joi.string().required(),
    employeeEmail: Joi.string().required(),
    bloodGroup: Joi.string().required(),
    guardianType:Joi.string().required(),
    guardianName:Joi.string().required(),
    guardianMobile:Joi.string().required(),
    joiningDate: Joi.string().required(),
    Dob:Joi.string().required(),
    resignedDate:Joi.string().required(),
    Designation: Joi.string().required(),
    monthlySalary:Joi.string().required(),
    employeeAddress:Joi.string().required(),
    emplpoyeeImage: Joi.string().optional().allow(null,""),
    workStatus:Joi.string().required(),
    
});


export interface employeeRegistrationDto{
    employeeId:string;
    employeeName: string;
    Gender: string;
    employeeMobile: string;
    employeeEmail: string;
    bloodGroup: string;
    guardianType:string;
    guardianName:string;
    guardianMobile:string;
    joiningDate: string;
    Dob:string;
    resignedDate:string;
    Designation: string;
    monthlySalary:string;
    employeeAddress:string;
    emplpoyeeImage: string;
    workStatus: string;

}