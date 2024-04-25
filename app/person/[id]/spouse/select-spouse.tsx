"use client";

import { PersonRow } from "../../../../test/types.ts";
import { useFormStatus } from "react-dom";
import { appendSpouse } from "../form-actions.ts";
import { usePeople } from "../../../../components/use-people.tsx";

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
						{person.fullname}
					</option>
				))}
			</select>
			<button type="submit" className="btn btn-primary" disabled={pending}>
				Submit
			</button>
		</form>
	);
}
