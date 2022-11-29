import { authCheck } from "./auth-check";
import { NextApiRequest, NextApiResponse } from "next";
import chalk from "chalk";

export async function handleGet(
	req: NextApiRequest,
	res: NextApiResponse,
	code: Function
) {
	try {
		await authCheck(req);
		const output = await code(req, res);
		return res.json(output);
	} catch (e) {
		console.error(chalk.red('API ERROR'), e);
		res.status(500).json({
			method: req.method,
			status: e.constructor.name,
			message: e.message,
			response: e.response?.data,
			stack: e.stack.split("\n"),
		});
	}
}
