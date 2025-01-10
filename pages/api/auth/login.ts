import { NextApiRequest, NextApiResponse } from "next";
import { getIronSession } from "iron-session";
import invariant from "tiny-invariant";
import { getDb } from "../../../lib/pg-sql/db-config";
import { PersonRow } from "../../../test/types";
import { cookies } from "next/headers";
import { ServerSession } from "../../../lib/use-client-session.tsx";

export async function getMySession(req: NextApiRequest, res: NextApiResponse) {
	invariant(process.env.IRON_PASSWORD, "IRON_PASSWORD is not defined");
	invariant(process.env.IRON_COOKIE_NAME, "IRON_COOKIE_NAME is not defined");
	const session = await getIronSession<ServerSession>(req, res, {
		password: process.env.IRON_PASSWORD,
		cookieName: process.env.IRON_COOKIE_NAME,
	});
	console.log("getMySession", session);
	return session;
}

export async function getPageSession() {
	invariant(process.env.IRON_PASSWORD, "IRON_PASSWORD is not defined");
	invariant(process.env.IRON_COOKIE_NAME, "IRON_COOKIE_NAME is not defined");
	const session = await getIronSession<ServerSession>(await cookies(), {
		password: process.env.IRON_PASSWORD,
		cookieName: process.env.IRON_COOKIE_NAME,
	});
	// console.log("session", session);
	return session;
}

export async function getPersonByEmail(email: string) {
	const db = await getDb();
	return await db.people.selectOne({ email });
}

export default async function loginHandler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const session = await getMySession(req, res);
	const email = req.body.email;
	invariant(email, "no email provided");
	const dateOfBirth = req.body.dateOfBirth;
	invariant(dateOfBirth, "no dateOfBirth provided");
	const db = await getDb();
	let where = {
		email,
		bfdate: new Date(dateOfBirth).toISOString().substring(0, 10),
	} as Partial<PersonRow & { bfdate: string }>;
	const person = await db.people.selectOne(where);
	// console.log(where, person);
	if (person) {
		session.user = req.body.email;
		await session.save();
		res.status(200).json({ status: "ok" });
	} else {
		res.status(400).json({ status: "login denied" });
	}
}
