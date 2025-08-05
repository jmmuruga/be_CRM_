import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const Entities = [

]

export const appSource = new DataSource({
  type: "mssql",
  host: process.env.DB_SERVER_HOST,
  port: parseInt(process.env.DB_PORT as string),
  // schema: 'Finance',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  synchronize: true,
  // autoLoadEntities: true,
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