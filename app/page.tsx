import { getPeople, getPerson } from "./person/[id]/form-actions";
import ApexTreeClient from "./apex-tree-client";
import { PersonRowNormalized } from "../test/types";
import { Json } from "spidgorny-react-helpers/debug";
import invariant from "tiny-invariant";
import { getPageSession, getPersonByEmail } from "../pages/api/auth/login";
import Link from "next/link";
import { PersonImage } from "./person-image.tsx";

export default async function Home(props: {
	params: Promise<never>;
	searchParams: Promise<{ person: string }>;
}) {
	const searchParams = await props.searchParams;
	const session = await getPageSession();
	const sessionPerson = session.user
		? await getPersonByEmail(session.user)
		: null;
	console.log("sessionPerson in Home", sessionPerson);
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
				<div className="d-flex gap-3">
					<Link href={`/person/${person.id}`}>
						<PersonImage person={person} />
					</Link>
					<h4>{person.fullname}</h4>
				</div>
				<div>
					<Link className="btn btn-outline-info" href={`/person/${person.id}`}>
						more
					</Link>
				</div>
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
		imageUrl: rootPerson.doc?.preview
			? `data:image/png;base64,${rootPerson.doc?.preview}`
			: null,
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
		imageUrl: rootPerson.doc?.preview
			? `data:image/png;base64,${rootPerson.doc?.preview}`
			: null,
		children,
	};

	// Return the root node
	return rootNode;
}
