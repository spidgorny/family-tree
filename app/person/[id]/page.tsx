"use server";

import Image from "next/image";
import { SimpleTable } from "../../../components/simple-table.tsx";
import { ClickableFace } from "../../../components/clickable-face.tsx";
import { AddSpousePane } from "./spouse/add-spouse-pane.tsx";
import { getPerson } from "./form-actions";
import { EditPersonPane } from "./edit/edit-person-pane.tsx";
import { AddChildPane } from "./child/add-child-pane.tsx";
import { AddParentPane } from "./add-parent-pane";
import invariant from "tiny-invariant";
import { CommentList } from "./comments/comment-list.tsx";
import { utcDate } from "../../../lib/common/date.ts";
import { PersonImages } from "./photo/person-images.tsx";
import { SpouseAndChildrenInfo } from "./spouse-and-children-info.tsx";

const YEAR = 365 * 24 * 60 * 60 * 1000;

export default async function PersonPage(props: { params: Promise<{ id: string }> }) {
	const id = (await props.params).id;
	const person = await getPerson(id);
	invariant(person, `person not found by id=[${id}]`);
	let age = person.bfdate
		? `[${((Date.now() - person.bfdate.getTime()) / YEAR).toFixed(2)} years ago]`
		: "";
	let yearsSinceDeath = person.dfdate
		? `[${((Date.now() - person.dfdate.getTime()) / YEAR).toFixed(2)} years ago]`
		: "";
	const personProps = {
		"First Name": person.fn,
		"Middle Name": person.mn,
		Surname: person.sn,
		Occupation: person.occu,
		Birthday: `${utcDate(person.bfdate)} ${age}`,
		Location: person.pl_full,
		Email: person.email,
		Deathday: `${utcDate(person.dfdate)} ${yearsSinceDeath}`,
		"Death reason": person.dreason,
	};
	const spouseList = person.spouse
		? Array.isArray(person.spouse)
			? person.spouse
			: [person.spouse]
		: [];
	return (
		<div>
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

			<div className="d-flex justify-content-between align-items-center mb-3">
				<h1>
					{person.sex === "1" ? "♂️" : "♀️"} {person?.fullname}
				</h1>
				<EditPersonPane person={person} />
			</div>
			<div className="d-flex gap-3 flex-column flex-md-row align-items-center">
				{person.doc?.preview ? (
					<Image
						src={`data:image/png;base64,${person.doc.preview}`}
						width={256}
						height={256}
						alt="Face"
					/>
				) : (
					<div className="border rounded" style={{ width: 256, height: 256 }} />
				)}
				<SimpleTable props={personProps} />
			</div>

			{person.comment && (
				<pre
					style={{ whiteSpace: "pre-wrap", backgroundColor: "#888" }}
					className="p-1"
				>
					{person.comment}
				</pre>
			)}

			<div className="d-flex justify-content-between align-items-center">
				<h4 className="mt-3">Descendants</h4>
				<AddSpousePane to={person.id} />
			</div>
			{spouseList.map((spouse) => (
				<SpouseAndChildrenInfo
					person={person}
					spouseData={spouse}
					key={spouse.id}
				/>
			))}

			<CommentList person={person} className="mb-3" />
			<PersonImages person={person} />

			<pre className="bg-gray-500 p-2 my-3" style={{ fontSize: "8pt" }}>
				{JSON.stringify(person, null, 2)}
			</pre>
		</div>
	);
}
