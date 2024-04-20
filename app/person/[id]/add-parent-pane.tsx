"use client";

import "react-sliding-pane/dist/react-sliding-pane.css";
import { useState } from "react";
import SlidingPane from "react-sliding-pane";
import { AddAnyPerson } from "./add-spouse-form";
import { SelectParent } from "./select-person";

export function AddParentPane(props: {
	id: string;
	type: "father" | "mother";
}) {
	const [state, setState] = useState(false);

	return (
		<div>
			<button onClick={() => setState(true)}>Add Parent</button>
			<SlidingPane
				isOpen={state}
				title={`New Child`}
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

				<h4>Select Parent</h4>
				<SelectParent
					to={props.id}
					type={props.type}
					onClose={() => setState(false)}
				/>
			</SlidingPane>
		</div>
	);
}
