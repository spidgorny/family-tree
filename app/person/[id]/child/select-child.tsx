"use client";

import { useFormStatus } from "react-dom";
import { addChild } from "../form-actions.ts";
import { usePeople } from "../../../../components/use-people.tsx";
import { Combobox, DropdownList } from "react-widgets/esm";
import "react-widgets/styles.css";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";

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
			<DropdownList
				name="childId"
				data={people}
				textField="fullname"
				dataKey="id"
				disabled={pending}
				className="mb-3"
			/>
			<SaveButton type="submit" disabled={pending}>
				Submit
			</SaveButton>
		</form>
	);
}
