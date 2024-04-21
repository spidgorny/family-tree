import { MysqlTable } from "./mysql-table";
import { MysqlConnector } from "./mysql-connector";

export class MagicTable {
	target: MysqlConnector;
	people: MysqlTable;
	marriage: MysqlTable;

	constructor(target: MysqlConnector) {
		this.target = target;
		return new Proxy(target, this);
	}

	get(target: MysqlConnector, prop: string) {
		return this[prop] || this.target.getTable(prop);
	}

	query(sql, args = []) {
		return this.target.query(sql, args);
	}

	getTable(tableName) {
		return this.target.getTable(tableName);
	}
}
