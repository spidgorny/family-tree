import type { NextApiRequest, NextApiResponse } from "next";
import * as fs from "fs/promises";
import { handleGet } from "../../lib/api-handler";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	return handleGet(req, res, async () => {
		let xml = await fs.readFile("./public/export/export.xml", "utf8");
		res.status(200).send(xml);
	});
}
