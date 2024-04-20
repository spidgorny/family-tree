import { PersonRow } from "../../../test/types";
import Link from "next/link";
import Image from "next/image";
import { getPerson } from "./form-actions";

export async function ClickableFace(props: { id: string }) {
	const person = (await getPerson(props.id)) as PersonRow;
	if (!person) return <div>No Person with id=[{props.id}]</div>;
	return (
		<div className="border rounded-3 p-1 d-flex gap-2">
			<Link href={`/person/${person.id}`}>
				{person.doc?.preview ? (
					<Image
						src={`data:image/png;base64,${person.doc.preview}`}
						width={64}
						height={64}
						alt="Face"
					/>
				) : (
					<Image src={`/vercel.svg`} width={64} height={64} alt="No Face" />
				)}
			</Link>
			<div>
				<h6>
					<Link href={`/person/${person.id}`}>{person.fullname}</Link>
				</h6>
				<div style={{ fontSize: "8pt" }}>
					{person.bfdate?.toISOString().substring(0, 10)}
				</div>
			</div>
		</div>
	);
}
