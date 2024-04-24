import { PersonRowNormalized } from "../../../test/types.ts";
import { getDb } from "../../../lib/pg-sql/db-config.ts";
import { AddCommentPane } from "./add-comment-pane.tsx";
import { RenderComment } from "./render-comment.tsx";

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
		<div className="bg-body-secondary rounded p-3">
			<div className="d-flex justify-content-between">
				<h4>Comments</h4>
				<AddCommentPane person={props.person} />
			</div>
			<ul className="list-unstyled">
				{comments.map((el) => (
					<li key={el.id}>
						<RenderComment el={el} />
					</li>
				))}
			</ul>
		</div>
	);
}
