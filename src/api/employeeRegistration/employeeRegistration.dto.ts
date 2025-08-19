import Joi from "joi";

export const employeeRegistrationValidation = Joi.object({
  employeeId: Joi.string().required(),
  employeeName: Joi.string().required(),
  Gender: Joi.string().valid('Male', 'Female', 'Others').required(),
  employeeMobile: Joi.string().required(),
  employeeEmail: Joi.string().email().required(),
  bloodGroup: Joi.string().required(),
  guardianType: Joi.string().required(),
  guardianName: Joi.string().required(),
  guardianMobile: Joi.string().required(),
  joiningDate: Joi.string().required(),
  Dob: Joi.string().required(),
  resignedDate: Joi.string().allow(null, ""), 
  Designation: Joi.string().required(),
  monthlySalary: Joi.string().required(),
  employeeAddress: Joi.string().required(),
  employeeImage: Joi.string().optional().allow(null, ""),
  workStatus: Joi.string().valid('Currently Working', 'Resigned').required(), 
});



export interface employeeRegistrationDto {
  employeeId: string;
  employeeName: string;
  Gender: string;
  employeeMobile: string;
  employeeEmail: string;
  bloodGroup: string;
  guardianType: string;
  guardianName: string;
  guardianMobile: string;
  joiningDate: string;
  Dob: string;
  Designation:string;
  resignedDate?: string;  
  monthlySalary: string;
  employeeAddress: string;
  employeeImage: string; 
  workStatus: string;
  
}

export interface EmployeeDetailsStatus{
  employeeId: string;
  status: boolean;
}
