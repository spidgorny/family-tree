import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { serverPath } from "../../lib/common/next-js.ts";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	console.log("cwd", process.cwd());
	let xml = await fs.readFile(serverPath("public/export.xml"), "utf8");
	let tree = await parseStringPromise(xml, {
		trim: true,
		explicitArray: false,
		mergeAttrs: true,
	});
	// console.log(tree);
	res.status(200).json(tree);
}
