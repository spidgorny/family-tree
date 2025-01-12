"use client";

import { PersonRow } from "../../../../test/types.ts";
import { useFormStatus } from "react-dom";
import { addChild, addParent } from "../form-actions.ts";
import { usePeople } from "../../../../components/use-people.tsx";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";

export function SelectParent(props: {
	to: string;
	type: "father" | "mother";
	onClose: () => void;
}) {
	let { people } = usePeople();
	people = people.filter((x) => x.id !== props.to);
	const { pending } = useFormStatus();
	return (
		<form
			action={async (formData: FormData) => {
				console.log(formData);
				await addParent(props.to, props.type, formData);
				props.onClose();
			}}
		>
			<select name="parentId" className="form-control mb-3">
				{people.map((person: PersonRow) => (
					<option key={person.id} value={person.id}>
						{person.fullname}
					</option>
				))}
			</select>
			<SaveButton type="submit" disabled={pending}>
				Submit
			</SaveButton>
		</form>
	);
}
