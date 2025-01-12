"use client";

import { useState } from "react";
import { SelectParent } from "./edit/select-person.tsx";
import { SlidingPaneAutoWidth } from "../../../components/sliding-page-auto-width.tsx";
import { Button } from "react-bootstrap";

export function AddParentPane(props: {
	id: string;
	type: "father" | "mother";
}) {
	const [state, setState] = useState(false);

	return (
		<div>
			<Button onClick={() => setState(true)}>
				Add {props.type.toUpperCase()}
			</Button>
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
