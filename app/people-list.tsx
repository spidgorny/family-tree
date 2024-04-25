"use client";
import { PersonLink } from "./person-link";
import { useContext } from "react";
import { SearchContext } from "./search-context";
import { usePeople } from "../components/use-people.tsx";

export function PeopleList() {
	const context = useContext(SearchContext);
	const { people } = usePeople();
	const searchResults = context.q
		? people.filter((x) => x.fullname.includes(context.q))
		: people;
	return (
		<ul className="p-0">
			{searchResults.map((person) => (
				<li key={person.id} className="text-nowrap overflow-hidden">
					<PersonLink person={person} />
				</li>
			))}
		</ul>
	);
}
