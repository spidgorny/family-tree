"use client";

import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import SlidingPane from "react-sliding-pane";
import { SelectSpouse } from "./select-spouse";
import { AddSpouseForm } from "./add-spouse-form";

export function AddSpousePane(props: { to: string }) {
	const [state, setState] = useState(false);

	return (
		<div>
			<button onClick={() => setState(true)}>Add Spouse</button>
			<SlidingPane
				isOpen={state}
				title="New Spouse"
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

				<h4>Select spouse</h4>
				<SelectSpouse to={props.to} onClose={() => setState(false)} />

				<h4>New Person (+ add spouse)</h4>
				<AddSpouseForm to={props.to} onClose={() => setState(false)} />
			</SlidingPane>
		</div>
	);
}
