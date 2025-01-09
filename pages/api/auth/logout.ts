import { NextApiRequest, NextApiResponse } from "next";
import { getMySession } from "./login";

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const session = await getMySession(req, res);
	session.user = undefined;
	await session.save();
	res.status(200).json({ status: "ok" });
}
