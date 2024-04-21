import Builder from "json-sql";
import { UpdateSet, Where } from "./table-ref";

const jsonSql = Builder({
	namedValues: false,
	// valuesPrefix: '$$',
});
jsonSql.setDialect("postgresql");

export function getSelectQuery(
	tableName: string,
	condition: Where,
	options: UpdateSet = {},
) {
	const sql = jsonSql.build({
		type: "select",
		table: tableName,
		condition,
		...options,
	});
	return sql;
}

export function getInsertQuery(tableName: string, insertFields: UpdateSet) {
	const sql = jsonSql.build({
		type: "insert",
		table: tableName,
		values: insertFields,
	});
	return sql;
}

export function getDeleteQuery(tableName: string, condition: Where) {
	const sql = jsonSql.build({
		type: "remove",
		table: tableName,
		condition,
	});
	return sql;
}

export function getUpdateQuery(
	tableName: string,
	updateFields: UpdateSet,
	condition = {},
) {
	const sql = jsonSql.build({
		type: "update",
		table: tableName,
		condition,
		modifier: updateFields,
	});
	return sql;
}

export function getInsertUpdateQuery(
	tableName: string,
	insertFields: UpdateSet,
	conflictColumns: string[],
	updatePlus = {},
) {
	const insert = getInsertQuery(tableName, insertFields);
	insert.query = insert.query.substring(0, insert.query.length - 1); // remove ";"
	insert.query += ` ON CONFLICT (${conflictColumns.join(", ")}) DO `;
	const update = getUpdateQuery(tableName, {
		...insertFields,
		...updatePlus,
	});
	insert.query += update.query.replace(`"${tableName}"`, "");
	//logger.log(insert.query);
	insert.values = [...insert.values]; // ...update.values this is a hack
	return insert;
}
