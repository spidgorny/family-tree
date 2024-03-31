import {runTest} from "./bootstrap";
import {getDb} from "../lib/mysql/db-config";

void runTest(async () => {
  const tPerson = (await getDb()).getTable("people");
  console.log(await tPerson.selectOne({}))
})
