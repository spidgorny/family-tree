import { ClickableFace } from "../../../components/clickable-face.tsx";
import { AddChildPane } from "./child/add-child-pane.tsx";
import { getPerson } from "./form-actions.ts";
import { PersonRowNormalized, Spouse } from "../../../test/types.ts";
import invariant from "tiny-invariant";

export async function SpouseAndChildrenInfo(props: {
	person: PersonRowNormalized;
	spouseData: Spouse;
}) {
	const spousePerson = await getPerson(props.spouseData.id);
	// invariant(spousePerson, `spousePerson missing for ${props.spouseData.id}`);
	if (!spousePerson) {
		return "No Spouse";
	}
	return (
		<div className="d-flex gap-3 mb-3">
			<div style={{ flex: 1 }}>
				{props.spouseData.id && <ClickableFace id={props.spouseData.id} />}
			</div>
			<div style={{ flex: 1 }} className="">
				{props.spouseData.child?.map((child) => (
					<ClickableFace key={child.id} id={child.id} />
				))}
				<div className="mt-3">
					<AddChildPane id={props.person.id} spouse={spousePerson} />
				</div>
			</div>
		</div>
	);
}
