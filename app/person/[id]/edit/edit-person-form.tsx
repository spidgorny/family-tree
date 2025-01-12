"use client";

import { useFormStatus } from "react-dom";
import { savePerson } from "../form-actions.ts";
import { PersonRowNormalized } from "../../../../test/types.ts";
import { utcDate } from "../../../../lib/common/date.ts";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";

export function EditPersonForm(props: {
	person: PersonRowNormalized;
	onClose: () => void;
}) {
	const { pending } = useFormStatus();
	return (
		<form
			action={async (formData: FormData) => {
				await savePerson(props.person.id, formData);
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
					defaultValue={props.person.email}
				/>
			</label>
			<label className="form-label d-block mb-3">
				First Name
				<input
					name="fn"
					className="form-control"
					defaultValue={props.person.fn}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Middle Name
				<input
					name="mn"
					className="form-control"
					defaultValue={props.person.mn}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Last Name
				<input
					name="sn"
					className="form-control"
					defaultValue={props.person.sn}
				/>
			</label>
			<div>
				Sex assigned at birth
				<label className="form-label d-block">
					<input
						name="sex"
						type="radio"
						className="form-check-inline"
						value={1}
						defaultChecked={props.person.sex === "1"}
					/>{" "}
					Male
				</label>
				<label className="form-label d-block">
					<input
						name="sex"
						type="radio"
						className="form-check-inline"
						value={0}
						defaultChecked={props.person.sex === "0"}
					/>{" "}
					Female
				</label>
			</div>
			<label className="form-label d-block mb-3">
				Location
				<input
					name="pl_full"
					className="form-control"
					defaultValue={props.person.pl_full}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Occupation
				<input
					name="occu"
					className="form-control"
					defaultValue={props.person.occu}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Date of birth ({utcDate(props.person.bfdate)})
				<input
					name="bfdate"
					type="date"
					className="form-control"
					defaultValue={utcDate(props.person.bfdate) ?? ""}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Birth Place
				<input
					name="bplace"
					className="form-control"
					defaultValue={props.person.bplace}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Date of F?
				<input
					name="dfdate"
					type="date"
					className="form-control"
					defaultValue={props.person.dfdate?.toISOString() ?? ""}
				/>
			</label>
			<label className="form-label d-block mb-3">
				Comment
				<textarea
					name="comment"
					className="form-control"
					defaultValue={props.person.comment}
				></textarea>
			</label>
			<label className="form-label d-block mb-3">
				Death reason
				<textarea
					name="dreason"
					className="form-control"
					defaultValue={props.person.dreason}
				></textarea>
			</label>
			<SaveButton type="submit" disabled={pending}>
				Submit
			</SaveButton>
		</form>
	);
}
