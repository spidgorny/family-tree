"use client";

import { useFormStatus } from "react-dom";
import { addPerson, addSpouse } from "../form-actions.ts";

export function AddSpouseForm(props: { to: string; onClose: () => void }) {
	return (
		<form
			action={async (formData: FormData) => {
				await addSpouse(props.to, formData);
				props.onClose();
			}}
		>
			<NewPersonForm />
		</form>
	);
}

export function AddAnyPerson(props: { onClose: () => void }) {
	return (
		<form
			action={async (formData: FormData) => {
				await addPerson(formData);
				props.onClose();
			}}
		>
			<NewPersonForm />
		</form>
	);
}

export function NewPersonForm(props: {}) {
	const { pending } = useFormStatus();
	return (
		<div>
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
		</div>
	);
}
