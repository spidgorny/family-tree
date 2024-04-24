"use client";
import { CommentRow } from "../../../test/types.ts";
import { usePeople } from "./use-people.tsx";
import { utcDate } from "../../../lib/date.ts";
import Image from "next/image";

export function RenderComment(props: { el: CommentRow }) {
	const { people } = usePeople();
	const commenter = people.find((x) => x.email === props.el.created_by);
	return (
		<div className="d-flex gap-3">
			<div>
				{commenter?.doc?.preview ? (
					<Image
						src={`data:image/png;base64,${commenter.doc.preview}`}
						width={64}
						height={64}
						alt="Face"
					/>
				) : (
					<Image src={`/noface.png`} width={64} height={64} alt="No Face" />
				)}
			</div>
			<div>
				<div className="fw-bold">{commenter?.fullname}</div>
				{utcDate(props.el.created_at)}
				<pre className="my-3">{props.el.bodytext}</pre>
			</div>
			<hr className="bg-black" />
		</div>
	);
}
