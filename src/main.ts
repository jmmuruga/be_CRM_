import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./core/dataBase/db";
import domainRegistrationRouter from "./api/Master/domainRegistration/domainRegistration.controller";
import domainMasterRouter from "./api/Master/domainMaster/domainMaster.controller";
import userDetailsRouter from "./api/Admin/userDetails/userDetails.controller";
import companyRegistrationRouter from "./api/Admin/companyRegistration/companyRegistration.controller";
import newCustomerRegistrationRouter from "./api/New Customer/newCustomer/newCustomer.controller";
import employeeRegistrationRouter from "./api/Employee/employeeRegistration/employeeRegistration.controller";
import hostingMasterRouter from "./api/Master/hostingMaster/hostingMaster.controller";
import serviceProviderRouter from "./api/Master/serviceProviderMaster/serviceProviderMaster.controller";
import serverMasterRouter from "./api/Master/serverMaster/serverMaster.controller";
import logsRouter from "./api/Admin/logs/logs.controller";
import superAdminRegistrationRouter from "./api/superAdminRegistration/superAdminReg.controller";
import { pinSetting } from "./api/Admin/pinSetting/pinSeting.model";
import pinSettingRouter from "./api/Admin/pinSetting/pinSeting.controller";
import backupSettingRouter from "./api/Admin/backup/backup.controller";
import customizeThemeRouter from "./api/Admin/themeChange/themeChange.controller";
import logInRouter from "./api/logIn/logIn.controller";
import userRightsRouter from "./api/Admin/userRights/userRights.controller";
import creditDebitRouter from "./api/Credit Debit/credit-debit/credit-debit.controller";


const app = express();

dotenv.config();
const PORT = process.env.PORT;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.get('/', (req, res) => {
  console.log("✅ Root route hit");
  res.send("Root working");
});
app.use('/domainRegistration' , cors(corsOptions) , domainRegistrationRouter);
app.use('/domainMaster' , cors(corsOptions) , domainMasterRouter);
app.use('/userRegistration' , cors(corsOptions) , userDetailsRouter);
app.use('/companyRegistration' , cors(corsOptions) , companyRegistrationRouter);
app.use('/newCustomerRegistration' , cors(corsOptions) , newCustomerRegistrationRouter);
app.use('/employeeRegistration' , cors(corsOptions) , employeeRegistrationRouter);
app.use('/hostingMaster' , cors(corsOptions) , hostingMasterRouter);
app.use('/serviceProvider' , cors(corsOptions) , serviceProviderRouter);
app.use('/serverMaster' , cors(corsOptions) , serverMasterRouter);
app.use('/logIn' , cors(corsOptions) , logInRouter);
app.use('/logsReport' , cors(corsOptions) , logsRouter);
app.use('/superAdminRegistration' , cors(corsOptions) , superAdminRegistrationRouter);
app.use('/pinSetting' , cors(corsOptions) , pinSettingRouter);
app.use('/backupSetting' , cors(corsOptions) , backupSettingRouter);
app.use('/customizeTheme' , cors(corsOptions) , customizeThemeRouter);
app.use('/userRights' , cors(corsOptions) , userRightsRouter);
app.use('/creditDebit' , cors(corsOptions) , creditDebitRouter);

app.listen(PORT, () => console.log(`server upon port ${PORT}`));