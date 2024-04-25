import { NextRequest, NextResponse } from "next/server";
import { getMySession, getPageSession } from "../../pages/api/auth/login.ts";
import invariant from "tiny-invariant";

export async function routeHandler(
	req: NextRequest,
	next: () => Promise<NextResponse>,
) {
	try {
		const startTime = Date.now();
		const session = await getPageSession();
		invariant(session, "No session");
		invariant(session.user, "No User. Please login");
		let res = await next();
		if (res.headers.get("content-type") === "application/json") {
			let originalResponse = await res.json();
			// console.log("response is json", originalResponse);
			const runtime = (Date.now() - startTime) / 1000;
			res = NextResponse.json(
				{ ...originalResponse, runtime },
				{ status: res.status, headers: res.headers },
			);
		}
		return res;
	} catch (err) {
		return NextResponse.json(
			{
				status: "error",
				message: err.message,
				stack: err.stack.split("\n"),
			},
			{ status: 500 },
		);
	}
}
