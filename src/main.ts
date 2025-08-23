import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./core/dataBase/db";
import domainRegistrationRouter from "./api/domainRegistration/domainRegistration.controller";
import domainMasterRouter from "./api/domainMaster/domainMaster.controller";
import userDetailsRouter from "./api/userDetails/userDetails.controller";
import companyRegistrationRouter from "./api/companyRegistration/companyRegistration.controller";
import newCustomerRegistrationRouter from "./api/newCustomer/newCustomer.controller";
import employeeRegistrationRouter from "./api/employeeRegistration/employeeRegistration.controller";
import hostingMasterRouter from "./api/hostingMaster/hostingMaster.controller";

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
  optionsSuccessStatus: 204,
};
app.get('/', (req, res) => {
  console.log("✅ Root route hit");
  res.send("Root working");
});
app.use('/domainRegistration' , cors(corsOptions) , domainRegistrationRouter);
app.use('/domainMaster' , cors(corsOptions) , domainMasterRouter);
app.use('/userDetails' , cors(corsOptions) , userDetailsRouter);
app.use('/companyRegistration' , cors(corsOptions) , companyRegistrationRouter);
app.use('/newCustomerRegistration' , cors(corsOptions) , newCustomerRegistrationRouter);
app.use('/employeeRegistration' , cors(corsOptions) , employeeRegistrationRouter);
app.use('/hostingMaster' , cors(corsOptions) , hostingMasterRouter);



app.listen(PORT, () => console.log(`server upon port ${PORT}`));