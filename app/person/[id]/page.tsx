"use server";

import Image from "next/image";
import { SimpleTable } from "./simple-table";
import { ClickableFace } from "./clickable-face";
import { AddSpousePane } from "./add-spouse-pane";
import { getPerson } from "./form-actions";
import { EditPersonPane } from "./edit-person-pane";
import { AddChildPane } from "./add-child-pane";
import { AddParentPane } from "./add-parent-pane";

const YEAR = 365 * 24 * 60 * 60 * 1000;

export default async function PersonPage(props: any) {
	const id = props.params.id;
	const person = await getPerson(id);
	let age = person.bfdate
		? `[${((Date.now() - person.bfdate.getTime()) / YEAR).toFixed(2)} years]`
		: "";
	const personProps = {
		"First Name": person.fn,
		"Middle Name": person.mn,
		Surname: person.sn,
		Occupation: person.occu,
		Birthday: `${person.bfdate?.toISOString().substring(0, 10) ?? ""} ${age}`,
		Location: person.pl_full,
		Email: person.email,
		Deathday: person.dfdate,
		"Death reason": person.dreason,
	};
	const spouseList = person.spouse
		? Array.isArray(person.spouse)
			? person.spouse
			: [person.spouse]
		: [];
	return (
		<div>
			<div className="d-flex justify-content-between align-items-center">
				<h1>
					{person.sex === "1" ? "♂️" : "♀️"} {person.fullname}
				</h1>
				<EditPersonPane person={person} />
			</div>
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

			<pre
				style={{ whiteSpace: "pre-wrap", backgroundColor: "#888" }}
				className="p-1"
			>
				{person.comment}
			</pre>

			<h4 className="mt-3">Parents</h4>
			<div className="d-flex gap-3 mb-3">
				<div style={{ flex: 1 }}>
					{person.father?.id && <ClickableFace id={person.father.id} />}
					{!person.father?.id && <AddParentPane id={person.id} type="father" />}
				</div>
				<div style={{ flex: 1 }}>
					{person.mother?.id && <ClickableFace id={person.mother.id} />}
					{!person.mother?.id && <AddParentPane id={person.id} type="mother" />}
				</div>
			</div>

			<div className="d-flex justify-content-between align-items-center">
				<h4 className="mt-3">Descendants</h4>
				<AddSpousePane to={person.id} />
			</div>
			{spouseList.map((spouse) => (
				<div className="d-flex gap-3 mb-3" key={spouse.id}>
					<div style={{ flex: 1 }}>
						{spouse?.id && <ClickableFace id={spouse.id} />}
					</div>
					<div style={{ flex: 1 }}>
						{spouse.child?.map((child) => (
							<ClickableFace key={child.id} id={child.id} />
						))}
						<AddChildPane id={person.id} spouseId={spouse.id} />
					</div>
				</div>
			))}

			<pre className="bg-gray-500 p-2 my-3" style={{ fontSize: "8pt" }}>
				{JSON.stringify(person, null, 2)}
			</pre>
		</div>
	);
}
