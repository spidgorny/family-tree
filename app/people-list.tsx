import Link from "next/link";
import { getPeople } from "./person/[id]/form-actions";

export async function PeopleList() {
	const people = await getPeople();
	return (
		<ul className="p-0">
			{people.map((person) => (
				<li key={person.id} className="text-nowrap overflow-hidden">
					<Link href={`/person/${person.id}`}>{person.fullname}</Link>
				</li>
			))}
		</ul>
	);
}
