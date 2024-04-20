"use client";

import { useFormStatus } from "react-dom";
import { addSpouse } from "./form-actions";

export function AddSpouseForm(props: { to: string; onClose: () => void }) {
	const { pending } = useFormStatus();
	const addSpouseWithTo = addSpouse.bind(null, props.to);
	return (
		<form
			action={async (formData: FormData) => {
				addSpouseWithTo(formData);
				props.onClose();
			}}
		>
			<label className="form-label d-block mb-3">
				Email address
				<input
					name="email"
					type="email"
					className="form-control"
					placeholder="name@example.com"
				/>
			</label>
			<label className="form-label d-block mb-3">
				First Name
				<input name="fn" className="form-control" />
			</label>
			<label className="form-label d-block mb-3">
				Middle Name
				<input name="mn" className="form-control" />
			</label>
			<label className="form-label d-block mb-3">
				Last Name
				<input name="sn" className="form-control" />
			</label>
			<button type="submit" className="btn btn-primary" disabled={pending}>
				Submit
			</button>
		</form>
	);
}
