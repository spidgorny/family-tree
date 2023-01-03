import invariant from "invariant";
import {MysqlConnector} from "./mysql-connector";
import {MagicTable} from "./magic-table";

let dbConnection;

export async function getDb() {
  if (dbConnection) {
    return new MagicTable(dbConnection);
  }
  invariant(process.env.MYSQL_HOST, "process.env.MYSQL_HOST missing");
  // let filePath = process.env.MYSQL_CERTIFICATE;
  // filePath = await findUp(filePath);
  // let ca = fs.readFileSync(filePath, "utf8");
  let ca = process.env.CA_CERTIFICATE_CRT;
  dbConnection = new MysqlConnector({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    // ssl: {
    //   ca,
    // },
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  return new MagicTable(dbConnection);
}
