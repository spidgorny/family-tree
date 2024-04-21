import { NextApiRequest } from "next";

export async function authCheck(req: NextApiRequest) {
	return true;
	// // const session = await getSession({ req });
	// let session = null;
	//
	// if (!session) {
	// 	throw new Error("Access denied. No session.");
	// }
	//
	// if (!session?.user) {
	// 	throw new Error("Access denied. No user.");
	// }
	//
	// // readonly by default is enabled
	// if (
	// 	req.method === "GET" ||
	// 	req.method === "POST" ||
	// 	req.method === "PATCH" ||
	// 	req.method === "DELETE"
	// ) {
	// 	// if (!isAllowedToLogin(session.user.email)) {
	// 	// 	throw new Error("Access denied. Wrong user.");
	// 	// }
	// }
	//
	// return true;
}
