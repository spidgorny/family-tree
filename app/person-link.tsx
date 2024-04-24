"use client";

import { PersonRowNormalized } from "../test/types";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export function PersonLink(props: { person: PersonRowNormalized }) {
	const pathname = usePathname();
	const queryString = useSearchParams();
	const isActive =
		pathname?.includes(props.person.id) ||
		queryString?.get("person") === props.person.id;
	return (
		<Link
			href={`/person/${props.person.id}`}
			className={
				isActive ? "fw-bold text-decoration-underline" : "text-decoration-none"
			}
		>
			<span className="me-1">
				{props.person.sex === "1" ? (
					<span className="text-danger">♂️</span>
				) : (
					<span className="text-info">♀️</span>
				)}
			</span>
			{props.person.fullname}
		</Link>
	);
}
