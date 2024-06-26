import { TableRef } from "./table-ref";
import { IClient } from "pg-promise/typescript/pg-subset";

export class PostgresConnector {
	alive = true;
	connection: IClient;
	connectionName: string;

	constructor(connection: IClient, connectionName?: string) {
		this.connection = connection;
		this.connectionName = connectionName ?? process.env.DB_SERVER ?? "default";
		this.alive = true;
	}

	async query(sql: string, args: any[] = []) {
		const res = await this.connection.query(sql, args);
		// console.log(res);
		return res;
	}

	async close() {
		//console.log('='.repeat(75));
		//console.log('close', this.connectionName);
		//console.log('='.repeat(75));
		this.alive = false;
		this.connection.release();
	}

	isAlive() {
		return this.alive;
	}

	getTable(tableName: string) {
		return new TableRef(this, tableName);
	}
}
