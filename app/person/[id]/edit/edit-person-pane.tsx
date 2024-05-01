"use client";

import { useState } from "react";
import { EditPersonForm } from "./edit-person-form.tsx";
import { PersonRowNormalized } from "../../../../test/types.ts";
import { SlidingPaneAutoWidth } from "../../../../components/sliding-page-auto-width.tsx";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";

export function EditPersonPane(props: { person: PersonRowNormalized }) {
	const [state, setState] = useState(false);

	return (
		<div>
			<SaveButton onClick={() => setState(true)}>Edit Person</SaveButton>
			<SlidingPaneAutoWidth
				isOpen={state}
				title="Edit Person"
				onRequestClose={() => setState(false)}
			>
				<EditPersonForm person={props.person} onClose={() => setState(false)} />
			</SlidingPaneAutoWidth>
		</div>
	);
}
