import { NextApiRequest, NextApiResponse } from "next";
import { getMySession, getPersonByEmail } from "./login";
import invariant from "tiny-invariant";

export default async function me(req: NextApiRequest, res: NextApiResponse) {
	const session = await getMySession(req, res);
	invariant(session, "Access denied. No session.");
	invariant(session.user, "Access denied. No user.");
	const user = await getPersonByEmail(session.user);
	res.status(200).json({ user });
}
