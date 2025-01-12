"use client";
import { PersonRowNormalized } from "../test/types.ts";
import Image from "next/image";
import { useFiles } from "./person/[id]/photo/person-images.tsx";

export function PersonImage({
	person,
	width,
}: {
	person: PersonRowNormalized;
	width?: number;
}) {
	const { data: currentPhotos } = useFiles(person.id);

	if (currentPhotos.length > 0) {
		const x = currentPhotos[0];
		const [_, folder, fileName] = x?.key?.split("/");
		return (
			<Image
				src={`/api/s3/${folder}/${fileName}`}
				width={width ?? 64}
				height={width ?? 64}
				alt={x.key}
				className="mw-100 h-auto object-fit-contain"
			/>
		);
	}

	return (
		<div>
			{person.doc?.preview ? (
				<Image
					src={`data:image/png;base64,${person.doc.preview}`}
					width={width ?? 64}
					height={width ?? 64}
					alt="Face"
					className="rounded-circle"
				/>
			) : (
				<Image
					src={`/noface.png`}
					width={width ?? 64}
					height={width ?? 64}
					alt="No Face"
				/>
			)}
		</div>
	);
}
