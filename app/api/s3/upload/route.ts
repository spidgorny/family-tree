import { NextRequest, NextResponse } from "next/server";
import { getS3Storage } from "../../../../lib/S3Storage.ts";
import path from "path";
import { revalidatePath } from "next/cache";
import { routeHandler } from "../../route-handler.ts";

export async function POST(req: NextRequest) {
	return routeHandler(req, async () => {
		const formData = await req.formData();
		console.log(formData);
		const files = formData.getAll("file") as File[];
		console.log(files);

		const storageFolder = process.env.STORAGE_FOLDER;
		const prefix = formData.get("prefix") as string;
		console.log({ prefix });
		const s3 = getS3Storage();

		const results = [] as string[];
		for (let file of files) {
			try {
				const basename = path.basename(file.name);
				let Key = `${storageFolder}/${prefix}/${basename}`;
				const res = await s3.put(Key, Buffer.from(await file.arrayBuffer()));
				console.log(basename, res);
				results.push(Key);
			} catch (err) {
				console.error(err);
			}
		}
		revalidatePath(`/person/${prefix}`);
		return NextResponse.json({ status: "ok", results });
	});
}
