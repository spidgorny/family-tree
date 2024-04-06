// import { fetcher } from "./fetcher";
import { getDb } from "../lib/mysql/db-config";
import { PersonRow } from "../test/types";
import Link from "next/link";
// import useSWR from "swr";

export async function PeopleList() {
	// const { isLoading, data } = useSWR("/api/people", fetcher);
	// const people = data?.people ?? [];
	const db = await getDb();
	const people = (await db.people.select({})) as PersonRow[];
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
