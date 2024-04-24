import { getPeople, getPerson } from "./person/[id]/form-actions";
import ApexTreeClient from "./apex-tree-client";
import { PersonRowNormalized } from "../test/types";
import { Json } from "spidgorny-react-helpers/debug";
import invariant from "tiny-invariant";
import {
	getMySession,
	getPageSession,
	getPersonByEmail,
} from "../pages/api/auth/login";

export default async function Home({
	params,
	searchParams,
}: {
	params: never;
	searchParams: { person: string };
}) {
	const session = await getPageSession();
	const sessionPerson = session.user
		? await getPersonByEmail(session.user)
		: null;
	let rootId = searchParams.person ?? sessionPerson?.id ?? "HhMd8ezTTI";
	const person = await getPerson(rootId);
	// console.log({ rootId });
	invariant(person, "Person not found");

	const people = await getPeople();
	const parentsTree = buildParentsTreeFrom(people, rootId);
	const childrenTree = buildChildrenTreeFrom(people, rootId);
	// console.log(childrenTree);
	return (
		<div className="my-3">
			<div className="d-flex justify-content-between my-3">
				<h4>{person.fullname}</h4>
				<a className="btn btn-outline-info" href={`/person/${person.id}`}>
					more
				</a>
			</div>
			<h5>Parents:</h5>
			<ApexTreeClient key={rootId + "1"} id="1" data={parentsTree} />
			<h5>Children:</h5>
			<ApexTreeClient
				key={rootId + "2"}
				id="2"
				data={childrenTree}
				direction="top"
			/>
			<Json data={parentsTree} />
		</div>
	);
}

function buildParentsTreeFrom(people: PersonRowNormalized[], rootId: string) {
	// Find the person with the id that matches rootId
	let rootPerson = people.find((person) => person.id === rootId);

	// If no person is found, return null
	if (!rootPerson) {
		return null;
	}
	invariant(rootPerson, "root person not found");

	let motherPerson = people.find((smb) => smb.id === rootPerson.mother?.id);
	let fatherPerson = people.find((smb) => smb.id === rootPerson.father?.id);

	let mother = motherPerson
		? buildParentsTreeFrom(people, motherPerson.id)
		: null;
	let father = fatherPerson
		? buildParentsTreeFrom(people, fatherPerson.id)
		: null;

	const rootNode = {
		id: rootPerson.id,
		name: rootPerson.fullname,
		sex: rootPerson.sex,
		children: [mother, father].filter(Boolean),
	};

	// Return the root node
	return rootNode;
}

function buildChildrenTreeFrom(people: PersonRowNormalized[], rootId: string) {
	// Find the person with the id that matches rootId
	let rootPerson = people.find((person) => person.id === rootId);

	// If no person is found, return null
	if (!rootPerson) {
		return null;
	}
	invariant(rootPerson, "root person not found");

	const children = people
		.filter((x) => x.father?.id === rootId || x.mother?.id === rootId)
		.map((x) => buildChildrenTreeFrom(people, x.id));
	const rootNode = {
		id: rootPerson.id,
		name: rootPerson.fullname,
		sex: rootPerson.sex,
		children,
	};

	// Return the root node
	return rootNode;
}
