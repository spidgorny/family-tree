"use server";

import { getDb } from "../../../lib/pg-sql/db-config";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import {
	CommentRow,
	PersonRow,
	PersonRowNormalized,
} from "../../../test/types";
import invariant from "tiny-invariant";
import { getMySession, getPageSession } from "../../../pages/api/auth/login.ts";

export async function savePerson(id: string, formData: FormData) {
	const data = Object.fromEntries(formData.entries()) as Record<string, any>;
	const db = await getDb();
	let payload = {
		...data,
		bfdate: data.bfdate || null,
		dfdate: data.dfdate || null,
	};
	console.log(payload);
	await db.people.update(payload, { id });
	revalidatePath(`/person/${id}`);
	return "ok";
}

export async function getPeople(): Promise<PersonRowNormalized[]> {
	const db = await getDb();
	const peopleList = (await db.people.select({})) as PersonRow[];
	return peopleList.map(normalizePerson);
}

let normalizePerson = (person: PersonRow): PersonRowNormalized => ({
	...person,
	fullname: person.fullname ?? `${person.fn} ${person.mn} ${person.sn}`,
	spouse: person.spouse
		? Array.isArray(person.spouse)
			? person.spouse
			: [person.spouse]
		: [],
});

export async function getPerson(id: string) {
	const db = await getDb();
	const person = (await db.people.selectOne({ id })) as PersonRow;
	return person ? (normalizePerson(person) as PersonRowNormalized) : null;
}

export async function appendSpouse(to: string, formData: FormData) {
	const data = Object.fromEntries(formData.entries()) as Record<string, any>;
	console.log(data);
	invariant(data.spouseId, "data.spouseId missing");
	const person = await getPerson(to);
	invariant(person, "person missing");
	const spouse = await getPerson(data.spouseId);
	invariant(spouse, "spouse missing");
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
	invariant(person, "person missing");
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
	const data = Object.fromEntries(formData.entries()) as { childId: string };
	console.log(data);
	invariant(data.childId, "data.childId missing");
	const person = await getPerson(to);
	invariant(person, "person missing");
	const child = await getPerson(data.childId);
	invariant(child, "child missing");
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
	const data = Object.fromEntries(formData.entries()) as { parentId: string };
	console.log(data);
	const db = await getDb();
	const person = await getPerson(data.parentId);
	invariant(person, "person missing");

	const fatherOrMother = person.sex === "1" ? "father" : "mother";
	let updateChild = {
		[fatherOrMother]: {
			id: person.id,
		},
	};
	console.log({ updateChild });
	await db.people.update(updateChild, { id });
	revalidatePath(`/person/${id}`);
	return "ok";
}

export async function addPerson(formData: FormData) {
	const data = Object.fromEntries(
		formData.entries(),
	) as Partial<PersonRowNormalized>;
	console.log(data);
	const db = await getDb();
	let newPerson = {
		id: nanoid(10),
		...data,
	};
	await db.people.insert(newPerson);
	revalidatePath(`/person/[id]`);
	return "ok";
}

export async function addComment(personId: string, formData: FormData) {
	const session = await getPageSession();
	const data = Object.fromEntries(formData.entries()) as Partial<CommentRow>;
	console.log(data);
	invariant(personId, "empty personId");
	invariant(data.bodytext, "empty comment?");
	const db = await getDb();
	let newComment = {
		id: nanoid(10),
		id_person: personId,
		created_by: session.user,
		created_at: new Date(),
		...data,
	};
	await db.comments.insert(newComment);
	revalidatePath(`/person/[id]`);
	return "ok";
}
