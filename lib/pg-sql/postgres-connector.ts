import { TableRef } from './table-ref';
import { Pool } from 'pg';

export class PostgresConnector {
	alive = true;
	connection: Pool;
	connectionName: string;

	constructor(connection: Pool, connectionName?: string) {
		this.connection = connection;
		this.connectionName =
			connectionName ?? process.env.DB_SERVER ?? 'default';
		this.alive = true;
	}

	async query(sql: string, args = []) {
		const res = await this.connection.query(sql, args);
		// console.log(res);
		return res;
	}

	async close() {
		//console.log('='.repeat(75));
		//console.log('close', this.connectionName);
		//console.log('='.repeat(75));
		this.alive = false;
		await this.connection.end();
	}

	isAlive() {
		return this.alive;
	}

	getTable(tableName: string) {
		return new TableRef(this, tableName);
	}
}
