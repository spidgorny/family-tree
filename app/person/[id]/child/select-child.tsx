"use client";

import { PersonRow } from "../../../../test/types.ts";
import { useFormStatus } from "react-dom";
import { addChild } from "../form-actions.ts";
import { usePeople } from "../../../../components/use-people.tsx";

export function SelectChild(props: {
	to: string;
	spouseId: string;
	onClose: () => void;
}) {
	let { people } = usePeople();
	people = people.filter((x) => x.id !== props.to);
	const { pending } = useFormStatus();
	return (
		<form
			action={async (formData: FormData) => {
				console.log(formData);
				await addChild(props.to, props.spouseId, formData);
				props.onClose();
			}}
		>
			<select name="childId" className="form-control">
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
