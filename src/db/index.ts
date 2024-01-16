import mysql, { Connection } from "mysql2";
import { environment } from "../config/environment";

const connection: Connection = mysql.createConnection({
  host: environment.db.HOST,
  user: environment.db.USER,
  password: environment.db.PASSWORD,
  database: environment.db.DB,
  port: environment.db.PORT,
});

export default connection;
