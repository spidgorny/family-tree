import { getDb } from "../../../lib/mysql/db-config";
import { PersonRow } from "../../../test/types";
import Image from "next/image";
import { SimpleTable } from "./simple-table";
import { ClickableFace } from "./clickable-face";

export default async function PersonPage(props: any) {
	const id = props.params.id;
	const db = await getDb();
	const person = (await db.people.selectOne({ id })) as PersonRow;
	const personProps = {
		"First Name": person.fn,
		"Middle Name": person.mn,
		Surname: person.sn,
		Occupation: person.occu,
		Birthday: person.bfdate?.toISOString().substring(0, 10),
		Location: person.pl_full,
	};
	const spouseList = person.spouse
		? Array.isArray(person.spouse)
			? person.spouse
			: [person.spouse]
		: [];
	return (
		<div>
			<h1>{person.fullname}</h1>
			<div className="d-flex gap-3">
				{person.doc?.preview ? (
					<Image
						src={`data:image/png;base64,${person.doc.preview}`}
						width={256}
						height={256}
						alt="Face"
					/>
				) : (
					<Image src={`/vercel.svg`} width={256} height={256} alt="No Face" />
				)}
				<SimpleTable props={personProps} />
			</div>

			<h4 className="mt-3">Parents</h4>
			<div className="d-flex gap-3 mb-3">
				<div style={{ flex: 1 }}>
					{person.father?.id && <ClickableFace id={person.father.id} />}
				</div>
				<div style={{ flex: 1 }}>
					{person.mother?.id && <ClickableFace id={person.mother.id} />}
				</div>
			</div>

			<h4 className="mt-3">Descendants</h4>
			{spouseList.map((spouse) => (
				<div className="d-flex gap-3 mb-3" key={spouse.id}>
					<div style={{ flex: 1 }}>
						{spouse?.id && <ClickableFace id={spouse.id} />}
					</div>
					<div style={{ flex: 1 }}>
						{spouse.child?.map((child) => (
							<ClickableFace key={child.id} id={child.id} />
						))}
					</div>
				</div>
			))}

			<pre className="bg-secondary-subtle p-2 my-3" style={{ fontSize: "8pt" }}>
				{JSON.stringify(person, null, 2)}
			</pre>
		</div>
	);
}
