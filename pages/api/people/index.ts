import type { NextApiRequest, NextApiResponse } from "next";
import { handleGet } from "../../../lib/api-handler";
import { getPeople } from "../../../app/person/[id]/form-actions";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	return handleGet(req, res, async () => {
		const people = await getPeople();
		return { people };
	});
}
