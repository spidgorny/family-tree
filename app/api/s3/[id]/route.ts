import { getS3Storage } from "../../../../lib/S3Storage";
import { NextRequest, NextResponse } from "next/server";
import { routeHandler } from "../../route-handler.ts";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	return routeHandler(req, async () => {
		const prefix = params.id;
		const s3 = getS3Storage();
		const storageFolder = process.env.STORAGE_FOLDER;
		const files = await s3.list(`${storageFolder}/${prefix}`);
		return NextResponse.json({ storageFolder, prefix, files });
	});
}
