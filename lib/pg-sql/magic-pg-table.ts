import { PostgresConnector } from "./postgres-connector";
import { TableRef } from "./table-ref";
import { CommentRow, PersonRow } from "../../test/types.ts";

export class MagicPgTable {
	target: PostgresConnector;
	people: TableRef<PersonRow>;
	comments: TableRef<CommentRow>;
	// marriage: TableRef;

	constructor(target: PostgresConnector) {
		this.target = target;
	}

	get(target: MagicPgTable, prop: string) {
		return target[prop] || target.getTable(prop);
	}

	query(sql: string, args: any[] = []) {
		return this.target.query(sql, args);
	}

	getTable(tableName: string) {
		return this.target.getTable(tableName);
	}
}
