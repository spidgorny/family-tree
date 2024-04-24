import {
	getDeleteQuery,
	getInsertQuery,
	getInsertUpdateQuery,
	getSelectQuery,
	getUpdateQuery,
} from "./query-builder";
import invariant from "tiny-invariant";
import { PostgresConnector } from "./postgres-connector";

export class TableRef<RowType extends { id: string | number }> {
	TABLE: string;
	db: PostgresConnector;

	constructor(db: PostgresConnector, table: string) {
		this.TABLE = table;
		this.db = db;
	}

	async query(sql: string, args: any[] = []) {
		return this.db.query(sql, args) as unknown as Promise<RowType[]>;
	}

	async select(where: Where, options: SqlOptions = {}) {
		const query = getSelectQuery(this.TABLE, where, options);
		// console.log(query.query);
		const res = await this.db.query(query.query, query.values);
		return res as unknown as RowType[];
	}

	async selectOne(where: Where, options: SqlOptions = {}) {
		const rows = await this.select(where, {
			...options,
			size: 1,
		});
		return rows[0] as RowType;
	}

	async insert(data: UpdateSet) {
		const query = getInsertQuery(this.TABLE, data);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async insertAndSelect(data: UpdateSet) {
		const query = getInsertQuery(this.TABLE, data);
		query.query = query.query.slice(0, -1) + " RETURNING id"; // only Postgres
		const res = await this.db.query(query.query, query.values);
		let firstRow = res.rows[0] as RowType;
		return this.selectOne({ id: firstRow.id });
	}

	async update(data: UpdateSet, where: Where) {
		const query = getUpdateQuery(this.TABLE, data, where);
		// console.log(query.query, query.values);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async deleteOne(where: Where) {
		const query = getDeleteQuery(this.TABLE, where);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async insertIfNotExists(data: UpdateSet, where: Where) {
		// console.log({ where });
		const found = await this.selectOne(where);
		// console.log({ found });
		if (found) {
			return;
		}
		return this.insert(data);
	}

	async insertUpdate(
		data: UpdateSet,
		conflictColumns: string[],
		updatePlus: UpdateSet = {},
	) {
		const query = getInsertUpdateQuery(
			this.TABLE,
			data,
			conflictColumns,
			updatePlus,
		);
		// console.log(query.query, query.values);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async *selectPages(where: Where, options: SqlOptions): AsyncGenerator<any[]> {
		const pageSize = options.limit;
		invariant(pageSize, "pageSize must be greater than 0");
		let rows: any[] = [];
		let offset = 0;
		do {
			rows = await this.select(where, { ...options, offset });
			yield rows;
			offset += pageSize;
		} while (rows.length);
	}
}

export type Where = Record<string, any>;
export type UpdateSet = Record<string, any>;
export type InsertSet = Record<string, any>;

export interface SqlOptions {
	limit?: number;
	size?: number;
	offset?: number;
	sort?: string | Record<string, number>;
	group?: string | string[];
	fields?: string[];
	distinct?: boolean;
}
