import { PostgresConnector } from "./postgres-connector";
import * as pg from "pg";
import invariant from "tiny-invariant";
import { MagicPgTable } from "./magic-pg-table";
import type { Pool } from "pg";

let dbConnection: Pool;

export async function getDb(): Promise<MagicPgTable> {
	invariant(process.env.POSTGRES_HOST, "process.env.POSTGRES_HOST");
	if (!dbConnection) {
		// logger.warn('connecting to', process.env.DB_SERVER);
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

export async function listDbRows() {
	const connector = new PostgresConnector(await getDb());
	const table = connector.getTable("gollum_file");
	const rows2 = await table.select({}, { limit: 10 });
	console.table(rows2);
}
