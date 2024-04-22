import { NextApiRequest, NextApiResponse } from "next";
import { getMySession } from "../pages/api/auth/login";
import invariant from "tiny-invariant";

export async function authCheck(req: NextApiRequest, res: NextApiResponse) {
	const session = await getMySession(req, res);
	invariant(session, "Access denied. No session.");
	invariant(session?.user, "Access denied. No user.");
	return true;
}
