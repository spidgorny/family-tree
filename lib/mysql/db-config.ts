import invariant from "invariant";
import { MagicTable, MysqlConnector } from "./mysql-connector";
import * as fs from "fs";
import { findUp } from "find-up";

let dbConnection;

export async function getDb() {
  if (dbConnection) {
    return new MagicTable(dbConnection);
  }
  invariant(process.env.MYSQL_HOST, "process.env.MYSQL_HOST missing");
  let filePath = process.env.MYSQL_CERTIFICATE;
  filePath = await findUp(filePath);
  dbConnection = new MysqlConnector({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    ssl: {
      ca: fs.readFileSync(filePath, "utf8"),
    },
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  return new MagicTable(dbConnection);
}
