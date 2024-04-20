import {
	getInsertQuery,
	getInsertUpdateQuery,
	getSelectQuery,
	getUpdateQuery,
} from "./query-builder";
import { PoolConnection } from "mysql2/promise";

export class MysqlTable {
	TABLE: string;
	db: PoolConnection;

	constructor(db, table: string) {
		this.TABLE = table;
		this.db = db;
	}

	async query(query: string, values?: Record<string, any>) {
		return this.db.query(query, values);
	}

	async select(where, options = {}) {
		const query = getSelectQuery(this.TABLE, where, options);
		// console.log(query.query);
		const [res] = await this.db.query(query.query, query.values);
		// console.log(res);
		return res;
	}

	async selectQ(where, options = {}) {
		const query = getSelectQuery(this.TABLE, where, options);
		// console.log(query.query);
		const [res] = await this.db.query(query.query, query.values);
		// console.log(res);
		return {
			...query,
			res,
		};
	}

	async selectOne(where, options = {}) {
		const rows = await this.select(where, {
			...options,
			size: 1,
		});
		// console.log(query.query);
		return rows[0];
	}

	async insert(data) {
		data = objectMap(data, (x) =>
			typeof x === "object" ? JSON.stringify(x) : x,
		);
		const query = getInsertQuery(this.TABLE, data);
		// console.log(query.query, query.values);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async update(data, where) {
		data = objectMap(data, (x) =>
			typeof x === "object" ? JSON.stringify(x) : x,
		);
		const query = getUpdateQuery(this.TABLE, data, where);
		// console.log(query.query, query.values);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async insertIfNotExists(data, where) {
		// console.log({ where });
		const found = await this.selectOne(where);
		// console.log({ found });
		if (found) {
			return;
		}
		return this.insert(data);
	}

	async insertUpdate(data, updatePlus = {}) {
		const query = getInsertUpdateQuery(this.TABLE, data, updatePlus);
		// console.log(query.query, query.values);
		const res = await this.db.query(query.query, query.values);
		return { ...res, query: query.query, values: query.values };
	}

	async *selectPages(where, options) {
		const pageSize = options.limit;
		let rows;
		let offset = 0;
		do {
			rows = await this.select(where, { ...options, offset });
			yield rows;
			offset += pageSize;
		} while (rows.length);
	}
}

export const objectMap = (obj, fn) =>
	Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)]));
