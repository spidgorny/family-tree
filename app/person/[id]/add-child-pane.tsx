"use client";

import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import SlidingPane from "react-sliding-pane";
import { SelectChild } from "./select-child";
import { AddAnyPerson } from "./add-spouse-form";

export function AddChildPane(props: { id: string; spouseId: string }) {
	const [state, setState] = useState(false);

	return (
		<div>
			<button onClick={() => setState(true)}>
				Add Child to {props.spouseId}
			</button>
			<SlidingPane
				isOpen={state}
				title={`New Child with ${props.spouseId}`}
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

				<h4>Select Child</h4>
				<SelectChild
					to={props.id}
					spouseId={props.spouseId}
					onClose={() => setState(false)}
				/>

				<h4>Add Person</h4>
				<AddAnyPerson onClose={() => setState(false)} />
			</SlidingPane>
		</div>
	);
}
