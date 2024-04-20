"use client";

import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import SlidingPane from "react-sliding-pane";
import { SelectSpouse } from "./select-spouse";
import { AddSpouseForm } from "./add-spouse-form";
import { EditPersonForm } from "./edit-person-form";
import { PersonRowNormalized } from "../../../test/types";

export function EditPersonPane(props: { person: PersonRowNormalized }) {
	const [state, setState] = useState(false);

	return (
		<div>
			<button onClick={() => setState(true)}>Edit Person</button>
			<SlidingPane
				isOpen={state}
				title="Edit Person"
				onRequestClose={() => setState(false)}
			>
				<style>
					{`
						.slide-pane__header {
							background-color: #888;
						}
						.slide-pane__content {
							background-color: #888;
						}						
				`}
				</style>

				<EditPersonForm person={props.person} onClose={() => setState(false)} />
			</SlidingPane>
		</div>
	);
}
