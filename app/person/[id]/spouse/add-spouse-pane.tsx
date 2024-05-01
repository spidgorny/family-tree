"use client";

import { useState } from "react";
import { SelectSpouse } from "./select-spouse.tsx";
import { AddSpouseForm } from "./add-spouse-form.tsx";
import { SlidingPaneAutoWidth } from "../../../../components/sliding-page-auto-width.tsx";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";

export function AddSpousePane(props: { to: string }) {
	const [state, setState] = useState(false);

	return (
		<div>
			<SaveButton onClick={() => setState(true)}>Add Spouse</SaveButton>
			<SlidingPaneAutoWidth
				isOpen={state}
				title="New Spouse"
				onRequestClose={() => setState(false)}
			>
				<h4>Select spouse</h4>
				<SelectSpouse to={props.to} onClose={() => setState(false)} />

				<h4>New Person (+ add spouse)</h4>
				<AddSpouseForm to={props.to} onClose={() => setState(false)} />
			</SlidingPaneAutoWidth>
		</div>
	);
}
