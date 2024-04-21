"use client";

import { PersonRowNormalized } from "../test/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function PersonLink(props: { person: PersonRowNormalized }) {
	const pathname = usePathname();
	return (
		<Link
			href={`/person/${props.person.id}`}
			className={
				pathname?.includes(props.person.id)
					? "fw-bold text-decoration-underline"
					: ""
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
