import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { domainMaster } from "../../api/Master/domainMaster/domainMaster.model";
import { userDetails } from "../../api/Admin/userDetails/userDetails.model";
import { domainRegistration } from "../../api/Master/domainRegistration/domainRegistration.model";
import { hostingMaster } from "../../api/Master/hostingMaster/hostingMaster.model";
import { serverMaster } from "../../api/Master/serverMaster/serverMaster.model";
import { serviceProviderMaster } from "../../api/Master/serviceProviderMaster/serviceProviderMaster.model";
import { companyRegistration } from "../../api/Admin/companyRegistration/companyRegistration.model";
import { employeeRegistration } from "../../api/Employee/employeeRegistration/employeeRegistration.model";
import { newCustomerRegistration } from "../../api/New Customer/newCustomer/newCustomer.model";
import { Logs } from "../../api/Admin/logs/logs.model";
import { forgetPasswordOtpStore } from "../../api/getOtpForgetPassword/getOtpForgetPassword.model";
import { pinSetting } from "../../api/Admin/pinSetting/pinSeting.model";
import { backupSetting } from "../../api/Admin/backup/backup.model";

const Entities = [
  domainMaster,
  userDetails,
  domainRegistration,
  hostingMaster,
  serverMaster,
  serviceProviderMaster,
  companyRegistration,
  employeeRegistration,
  newCustomerRegistration,
  Logs,
  forgetPasswordOtpStore,
  pinSetting,
  backupSetting
  
  
];

export const appSource = new DataSource({
  type: "mssql",
  host: process.env.DB_SERVER_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: true,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    cryptoCredentialsDetails: {
      minVersion: "TLSv1",
      trustServerCertificate: true,
    },
    encrypt: false
    // requestTimeout: 300000
  },
  extra: {
    trustServerCertificate: true,
    requestTimeout: 60000
  },
});

 appSource
  .initialize()
  .then((res) => console.log("SQL Server Connected"))
  .catch((error) => console.log(error, "Error while connecting to DB"));