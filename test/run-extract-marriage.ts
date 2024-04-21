import { runTest } from "./bootstrap";
import { getDb } from "../lib/mysql/db-config";
import { PersonRow } from "./types";
import { getPeople, getPerson } from "../app/person/[id]/form-actions";
import { nanoid } from "nanoid";

void runTest(async () => {
	let db = await getDb();
	let people = await getPeople();
	for (const person of people) {
		const spouseList = person.spouse
			? Array.isArray(person.spouse)
				? person.spouse
				: [person.spouse]
			: [];
		if (!spouseList.length) {
			continue;
		}
		console.log("====", person.id);
		for (let spouse of spouseList) {
			const spouse1 = await getPerson(spouse.id);
			console.log(
				person.fullname,
				`[${person.sex}]`,
				"married",
				spouse1.fullname,
				`[${spouse1.sex}]`,
				"on",
				spouse.marriage,
			);
			console.table(spouse.child);
			const wife = [person, spouse1].find((x) => x.sex === "0");
			const husband = [person, spouse1].find((x) => x.sex === "1");
			let marriage = {
				id: nanoid(10),
				wife: wife.id,
				husband: husband.id,
				created_at: new Date(),
				date: spouse.marriage?.date || null,
			};
			console.log({ marriage });
			await db.marriage.insertUpdate(marriage);
		}
	}
});
