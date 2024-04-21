import { runTest } from "./bootstrap";
import { getDb } from "../lib/pg-sql/db-config";
import { PersonRow } from "./types";

void runTest(async () => {
	const db = await getDb();
	let person = (await db.people.selectOne({})) as PersonRow;
	console.log(person);
});
