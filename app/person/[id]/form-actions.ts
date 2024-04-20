"use server";

import { getDb } from "../../../lib/mysql/db-config";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { PersonRow, PersonRowNormalized } from "../../../test/types";
import invariant from "tiny-invariant";

export async function getPeople() {
	const db = await getDb();
	return (await db.people.select({})) as PersonRow[];
}

export async function getPerson(id: string) {
	const db = await getDb();
	const person = (await db.people.selectOne({ id })) as PersonRow;
	return {
		...person,
		spouse: person.spouse ?? [],
	} as PersonRowNormalized;
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
