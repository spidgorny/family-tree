"use client";
import { PersonRowNormalized } from "../../../../test/types.ts";
import { useClientSession } from "../../../../lib/use-client-session.tsx";
import { DropArea } from "./drop-area.tsx";
import useSWR from "swr";
import { fetcher } from "../../../../lib/common/fetcher.tsx";
import { S3File } from "../../../../lib/S3Storage.ts";
import Image from "next/image";

export function PersonImages(props: { person: PersonRowNormalized }) {
	const session = useClientSession();
	const { data: currentPhotos } = useFiles(props.person.id);

	return (
		<div className="p-3 bg-white rounded">
			{session.user && <DropArea prefix={props.person.id} />}

			{currentPhotos.map((x) => {
				const [_, folder, fileName] = x.key.split("/");
				return (
					<div key={x.key}>
						<Image
							src={`/api/s3/${folder}/${fileName}`}
							width={1024}
							height={1024}
							alt={x.key}
							className="mw-100 h-auto object-fit-contain"
						/>
					</div>
				);
			})}
		</div>
	);
}

export function useFiles(prefix: string) {
	const { data, error, isLoading, mutate } = useSWR<{ files: S3File[] }>(
		`/api/s3/${prefix}`,
		fetcher,
	);
	return { data: data?.files ?? [], error, isLoading, mutate };
}
