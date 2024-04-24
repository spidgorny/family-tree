import { PersonRowNormalized } from "../../../test/types.ts";
import { getDb } from "../../../lib/pg-sql/db-config.ts";
import { SaveButton } from "spidgorny-react-helpers/save-button.tsx";

export async function CommentList(props: { person: PersonRowNormalized }) {
	let db = await getDb();
	const comments = await db.comments.select(
		{
			id_person: props.person.id,
		},
		{
			sort: { created_at: -1 },
		},
	);
	return (
		<div>
			<div className="d-flex justify-content-between">
				<h4>Comments</h4>
				<SaveButton>Add Comment</SaveButton>
			</div>
			<ul>
				{comments.map((el) => (
					<li key={el.id}>{el.created_at.toISOString()}</li>
				))}
			</ul>
		</div>
	);
}
