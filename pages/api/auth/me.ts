import { NextApiRequest, NextApiResponse } from "next";
import { getMySession } from "./login";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getMySession(req, res);
	res.status(200).json({ ...session });
};
