import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { domainMaster } from "../../api/domainMaster/domainMaster.model";
import { userDetails } from "../../api/userDetails/userDetails.model";
import { domainRegistration } from "../../api/domainRegistration/domainRegistration.model";
import { hostingMaster } from "../../api/hostingMaster/hostingMaster.model";
import { serverMaster } from "../../api/serverMaster/serverMaster.model";
import { serviceProviderMaster } from "../../api/serviceProviderMaster/serviceProviderMaster.model";
import { companyRegistration } from "../../api/companyRegistration/companyRegistration.model";
import { employeeRegistration } from "../../api/employeeRegistration/employeeRegistration.model";
import { newCustomerRegistration } from "../../api/newCustomer/newCustomer.model";

const Entities = [
  domainMaster,
  userDetails,
  domainRegistration,
  hostingMaster,
  serverMaster,
  serviceProviderMaster,
  companyRegistration,
  employeeRegistration,
  newCustomerRegistration
  
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