"use client";
import { PersonLink } from "./person-link";
import { useContext } from "react";
import { SearchContext } from "./search-context";
import { usePeople } from "../components/use-people.tsx";
import { PersonRow, PersonRowNormalized } from "../test/types.ts";
import cx from "classnames";

export function PeopleList() {
	const context = useContext(SearchContext);
	const { people } = usePeople();
	const searchResults = context.q
		? people.filter((x: PersonRowNormalized) =>
				x.fullname?.toLowerCase()?.includes(context.q.toLowerCase()),
			)
		: people;
	return (
		<div
			className={cx("col-12 col-md-3 py-3 d-md-flex overflow-hidden", {
				"d-none": !context.q,
			})}
		>
			<ul className="p-0">
				{searchResults.map((person: PersonRowNormalized) => (
					<li key={person.id} className="text-nowrap overflow-hidden">
						<PersonLink person={person} />
					</li>
				))}
			</ul>
		</div>
	);
}
