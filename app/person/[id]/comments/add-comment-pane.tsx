"use client";
import { useState } from "react";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";
import SlidingPane from "react-sliding-pane";
import { PersonRowNormalized } from "../../../../test/types.ts";
import { addComment, addPerson } from "../form-actions.ts";
import { NewPersonForm } from "../spouse/add-spouse-form.tsx";
import { useFormStatus } from "react-dom";
import { useClientSession } from "../../../../lib/use-client-session.tsx";
import { useStateObj } from "spidgorny-react-helpers/use-state-obj.tsx";
import { Alert } from "react-bootstrap";

export function AddCommentPane(props: { person: PersonRowNormalized }) {
	const [state, setState] = useState(false);

	return (
		<div>
			<SaveButton onClick={() => setState(true)}>Add Comment</SaveButton>
			<SlidingPane
				isOpen={state}
				title={`Add Comment`}
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

				<AddCommentForm person={props.person} onClose={() => setState(false)} />
			</SlidingPane>
		</div>
	);
}

function AddCommentForm(props: {
	person: PersonRowNormalized;
	onClose: () => void;
}) {
	const session = useClientSession();
	const error = useStateObj<Error>();
	const { pending } = useFormStatus();
	return (
		<form
			action={async (formData: FormData) => {
				try {
					await addComment(props.person.id, formData);
					props.onClose();
				} catch (e) {
					console.error(e);
					error.set(e);
				}
			}}
		>
			<div>
				<label className="form-label d-block mb-3">
					Comment by: <output>{session.user}</output>
				</label>
				<label className="form-label d-block mb-3">
					<textarea
						name="bodytext"
						className="form-control"
						style={{ height: "30em" }}
					/>
				</label>

				<SaveButton
					type="submit"
					className="btn btn-primary"
					disabled={pending}
				>
					Submit
				</SaveButton>

				<ErrorAlert error={error.value} />
			</div>
		</form>
	);
}

export function ErrorAlert(props: { error?: Error }) {
	if (!props.error) {
		return null;
	}

	return (
		<Alert variant="danger" className="my-3">
			{props.error.message}
		</Alert>
	);
}
