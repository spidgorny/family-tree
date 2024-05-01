"use client";

import { useState } from "react";
import { SelectChild } from "./select-child.tsx";
import { AddAnyPerson } from "../spouse/add-spouse-form.tsx";
import { SlidingPaneAutoWidth } from "../../../../components/sliding-page-auto-width.tsx";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";
import { PersonRowNormalized } from "../../../../test/types.ts";

export function AddChildPane(props: {
	id: string;
	spouse: PersonRowNormalized;
}) {
	const [state, setState] = useState(false);

	return (
		<div>
			<SaveButton onClick={() => setState(true)}>
				Add Child to {props.spouse.fullname}
			</SaveButton>
			<SlidingPaneAutoWidth
				isOpen={state}
				title={`New Child with ${props.spouse.id}`}
				onRequestClose={() => setState(false)}
			>
				<h4>Select Child</h4>
				<SelectChild
					to={props.id}
					spouseId={props.spouse.id}
					onClose={() => setState(false)}
				/>

				<h4 className="mt-3">Add Person</h4>
				<AddAnyPerson onClose={() => setState(false)} />
			</SlidingPaneAutoWidth>
		</div>
	);
}
