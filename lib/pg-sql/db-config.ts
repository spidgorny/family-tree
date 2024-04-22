import { PostgresConnector } from "./postgres-connector";
import * as pg from "pg";
import invariant from "tiny-invariant";
import { MagicPgTable } from "./magic-pg-table";
import type { Pool } from "pg";

let dbConnection: Pool;

export async function getDb(): Promise<MagicPgTable> {
	invariant(process.env.POSTGRES_HOST, "process.env.POSTGRES_HOST");
	if (!dbConnection) {
		console.log("connecting to", process.env.POSTGRES_HOST);
		// @ts-ignore
		dbConnection = new pg.default.Pool({
			user: process.env.POSTGRES_USER,
			host: process.env.POSTGRES_HOST,
			database: process.env.POSTGRES_DATABASE,
			password: process.env.POSTGRES_PASSWORD,
			ssl: {
				rejectUnauthorized: false,
			},
		});
	}
	await dbConnection.query("SET search_path TO 'family-tree'");
	const connector = new PostgresConnector(dbConnection);
	// logger.info(' -- connected');
	const target = new MagicPgTable(connector);
	return new Proxy(target, target) as MagicPgTable;
}

export async function testDb() {
	const db = await getDb();
	const { rows } = await db.query("SELECT $1::text as message", [
		"Hello world!",
	]);
	console.log("testDb", rows);
}
