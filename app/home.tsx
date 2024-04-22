import { getPeople } from "./person/[id]/form-actions";
import ApexTreeClient from "./apex-tree-client";
import { PersonRowNormalized } from "../test/types";
import { Json } from "spidgorny-react-helpers/debug";

export default async function Home() {
	const people = await getPeople();
	const data = buildTreeFrom(people, 'HhMd8ezTTI');
	return <Json data={data} />;
	// return <ApexTreeClient data={data} />;
}

function buildTreeFrom(people: PersonRowNormalized[], rootId: string) {
// Find the person with the id that matches rootId
	const rootPerson = people.find(person => person.id === rootId);

	// If no person is found, return null
	if (!rootPerson) return null;

	// Create the root node
	const rootNode = {
		id: rootPerson.id,
		name: rootPerson.fullname,
		children: [],
	};

	// For each person in the people list
	for (const person of people) {
		// If their parentId matches the rootId
		if (person.mother.id === rootId) {
			// Recursively build the tree for this person and add it to the children array
			const childNode = buildTreeFrom(people, person.id);
			if (childNode) {
				rootNode.children.push(childNode);
			}
		}
	}

	// Return the root node
	return rootNode;
}
