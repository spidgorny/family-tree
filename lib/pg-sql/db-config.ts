import { PostgresConnector } from "./postgres-connector";
import invariant from "tiny-invariant";
import { MagicPgTable } from "./magic-pg-table";
import PgPromise, { IInitOptions, IMain } from "pg-promise";
import { IClient, IConnection } from "pg-promise/typescript/pg-subset";

let dbConnection: IClient;

export async function getDb(): Promise<MagicPgTable> {
	invariant(process.env.POSTGRES_HOST, "process.env.POSTGRES_HOST");
	if (!dbConnection) {
		console.log("connecting to", process.env.POSTGRES_HOST);
		// @ts-ignore
		let PGMain = PgPromise() as IClient;
		// @ts-ignore
		dbConnection = PGMain({
			user: process.env.POSTGRES_USER,
			host: process.env.POSTGRES_HOST,
			database: process.env.POSTGRES_DATABASE,
			password: process.env.POSTGRES_PASSWORD,
			ssl: {
				rejectUnauthorized: false,
			},
			schema: ["family-tree"],
		} as IInitOptions);
	}
	// console.log({ dbConnection });
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
