"use client";

import { useState } from "react";
import { SelectParent } from "./edit/select-person.tsx";
import { SlidingPaneAutoWidth } from "../../../components/sliding-page-auto-width.tsx";

export function AddParentPane(props: {
	id: string;
	type: "father" | "mother";
}) {
	const [state, setState] = useState(false);

	return (
		<div>
			<button onClick={() => setState(true)}>Add Parent</button>
			<SlidingPaneAutoWidth
				isOpen={state}
				title={`New Child`}
				onRequestClose={() => setState(false)}
			>
				<h4>Select Parent</h4>
				<SelectParent
					to={props.id}
					type={props.type}
					onClose={() => setState(false)}
				/>
			</SlidingPaneAutoWidth>
		</div>
	);
}
