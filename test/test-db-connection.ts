import { runTest } from "./bootstrap";
import { getDb } from "../lib/mysql/db-config";
import { PersonRow } from "./types";

void runTest(async () => {
	const tPerson = (await getDb()).getTable("people");
	let person = (await tPerson.selectOne({})) as PersonRow;
	console.log(person);
});
