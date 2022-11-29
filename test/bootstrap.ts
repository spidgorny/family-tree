import dotenv from "dotenv";
import { findUp } from "find-up";
import invariant from "tiny-invariant";

export async function runTest(code) {
  console.log("Running test", process.uptime());
  //console.log("pwd", process.cwd());
  const envPath = await findUp(".env");
  console.log("env path " + envPath);
  dotenv.config({ path: envPath });
  invariant(process.env.MYSQL_HOST, "fix .env");

  const output = await code();
  console.log(output);

  console.log("done in", process.uptime());
  process.exit(0);
}
