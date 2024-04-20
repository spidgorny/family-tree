"use server";

import { getDb } from "../../../lib/mysql/db-config";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { PersonRow, PersonRowNormalized } from "../../../test/types";
import invariant from "tiny-invariant";

export async function savePerson(id: string, formData: FormData) {
	const data = Object.fromEntries(formData.entries()) as Record<string, any>;
	const db = await getDb();
	let payload = {
		...data,
		bfdate: data.bfdate || null,
		dfdate: data.dfdate || null,
	};
	console.log(payload);
	const res = await db.people.update(payload, { id });
	revalidatePath(`/person/${id}`);
	return "ok";
}

export async function getPeople() {
	const db = await getDb();
	const peopleList = (await db.people.select({})) as PersonRow[];
	return peopleList.map(normalizePerson);
}

let normalizePerson = (person: PersonRow) => ({
	...person,
	fullname: person.fullname ?? `${person.fn} ${person.mn} ${person.sn}`,
	spouse: person.spouse ?? [],
});

export async function getPerson(id: string) {
	const db = await getDb();
	const person = (await db.people.selectOne({ id })) as PersonRow;
	return normalizePerson(person) as PersonRowNormalized;
}

export async function appendSpouse(to: string, formData: FormData) {
	const data = Object.fromEntries(formData.entries()) as Record<string, any>;
	console.log(data);
	invariant(data.spouseId, "data.spouseId missing");
	const person = await getPerson(to);
	const spouse = await getPerson(data.spouseId);
	console.log("person", person.id, { sex: person.sex });

	const db = await getDb();
	await db.people.update(
		{
			spouse: [
				...person.spouse,
				{
					id: spouse.id,
					// @ts-ignore
					sex: spouse.sex,
				},
			],
		},
		{ id: to },
	);
	await db.people.update(
		{
			spouse: [
				...person.spouse,
				{
					id: person.id,
					// @ts-ignore
					sex: person.sex,
				},
			],
		},
		{ id: data.spouseId },
	);
	revalidatePath(`/person/${to}`);
	return "ok";
}

export async function addSpouse(to: string, formData: FormData) {
	const data = Object.fromEntries(formData.entries());
	console.log(data);
	const db = await getDb();
	const person = await getPerson(to);
	console.log("person", person.id, { sex: person.sex });
	let newPerson = {
		id: nanoid(10),
		...data,
		spouse: JSON.stringify([
			{
				id: person.id,
				sex: person.sex,
			},
		]),
	};
	const res = await db.people.insert(newPerson);
	console.log(res);
	const lastId = await db.people.query("SELECT LAST_INSERT_ID();");
	console.log({ lastId });
	await db.people.update(
		{
			spouse: [
				...person.spouse,
				{
					id: newPerson.id,
					// @ts-ignore
					sex: newPerson.sex,
				},
			],
		},
		{ id: to },
	);
	revalidatePath(`/person/${to}`);
	return "ok";
}

export async function addChild(
	to: string,
	spouseId: string,
	formData: FormData,
) {
	const data = Object.fromEntries(formData.entries()) as Record<string, any>;
	console.log(data);
	invariant(data.childId, "data.childId missing");
	const person = await getPerson(to);
	const child = await getPerson(data.childId);
	console.log("person/child", person.id, child.id);

	const db = await getDb();
	let spouseList = person.spouse.map((spouse) => {
		if (spouse.id === spouseId) {
			return {
				...spouse,
				child: [...(spouse.child ?? []), { id: child.id }],
			};
		}
		return spouse;
	});
	console.log(spouseList);
	await db.people.update(
		{
			spouse: spouseList,
		},
		{ id: to },
	);

	const fatherOrMother = person.sex === "1" ? "father" : "mother";
	let updateChild = {
		[fatherOrMother]: {
			id: person.id,
		},
	};
	console.log({ updateChild });
	await db.people.update(updateChild, { id: data.childId });
	revalidatePath(`/person/${to}`);
	return "ok";
}

export async function addParent(id: string, type: string, formData: FormData) {
	return "ok";
}

export async function addPerson(formData: FormData) {
	const data = Object.fromEntries(formData.entries()) as Record<string, any>;
	console.log(data);
	const db = await getDb();
	let newPerson = {
		id: nanoid(10),
		...data,
	};
	const res = await db.people.insert(newPerson);
	revalidatePath(`/person/[id]`);
	return "ok";
}
