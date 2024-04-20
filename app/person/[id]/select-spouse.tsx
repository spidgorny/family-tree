"use client";

import { PersonRow } from "../../../test/types";
import { useFormStatus } from "react-dom";
import { addSpouse, appendSpouse } from "./form-actions";
import { usePeople } from "./use-people";

export function SelectSpouse(props: { to: string; onClose: () => void }) {
	let { people } = usePeople();
	people = people.filter((x) => x.id !== props.to);
	const { pending } = useFormStatus();
	const addSpouseWithTo = appendSpouse.bind(null, props.to);
	return (
		<form
			action={async (formData: FormData) => {
				console.log(formData);
				addSpouseWithTo(formData);
				props.onClose();
			}}
		>
			<select name="spouseId" className="form-control">
				{people.map((person: PersonRow) => (
					<option key={person.id} value={person.id}>
						{person.fullname ?? person.fn + " " + person.mn + " " + person.sn}
					</option>
				))}
			</select>
			<button type="submit" className="btn btn-primary" disabled={pending}>
				Submit
			</button>
		</form>
	);
}
