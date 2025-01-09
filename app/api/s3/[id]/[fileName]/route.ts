import { getS3Storage } from "../../../../../lib/S3Storage";
import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "../../../route-handler.ts";

export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string; fileName: string }> }
) {
    const params = await props.params;
    return routeHandler(req, async () => {
		const prefix = params.id;
		const fileName = params.fileName;
		const s3 = getS3Storage();
		const storageFolder = process.env.STORAGE_FOLDER;
		const bytes = await s3.getBuffer(`${storageFolder}/${prefix}/${fileName}`);
		return new NextResponse(bytes, {
			headers: {
				"cache-control": "public, immutable, max-age=31536000",
				"content-type": "image/jpeg",
				"content-length": bytes.length.toString(),
			},
		});
	});
}
