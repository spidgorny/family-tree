import { runTest } from "./bootstrap";
import { getDb } from "../lib/mysql/db-config";
import { PersonRow } from "./types";

void runTest(async () => {
	let db = await getDb();
	const tPerson = db.getTable("people");
	let people = (await tPerson.select({})) as PersonRow[];
	people = await Promise.all(
		people.map(async (person) => {
			const spouseList = person.spouse
				? Array.isArray(person.spouse)
					? person.spouse
					: [person.spouse]
				: [];
			const spouse1 = await tPerson.selectOne({ id: spouseList[0]?.id });
			const spouse2 = await tPerson.selectOne({ id: spouseList[1]?.id });
			if (spouseList.length > 2) {
				console.log("!!! spouses", spouseList.length);
			}
			return {
				...person,
				spouse1: spouse1?.id,
				spouse2: spouse2?.id,
			};
		}),
	);
	console.table(people, ["fullname", "father", "mother", "spouse1", "spouse2"]);
});
