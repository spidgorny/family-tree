import { runTest } from "./bootstrap";
import fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { getDb } from "../lib/mysql/db-config";

runTest(async () => {
  const tPerson = (await getDb()).getTable("people");
  console.log(await tPerson.selectOne({}))
}).then();
