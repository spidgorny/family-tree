import Builder from "json-sql";

const jsonSql = Builder({
  dialect: "mysql",
  separatedValues: true,
  namedValues: false,
  valuesPrefix: "?",
  wrappedIdentifiers: false,
  indexedValues: false,
});
jsonSql.setDialect("mysql");

export function getSelectQuery(tableName, condition, options = {}) {
  const sql = jsonSql.build({
    type: "select",
    table: tableName,
    condition,
    ...options,
  });
  return sql;
}

export function getInsertQuery(tableName, insertFields) {
  const sql = jsonSql.build({
    type: "insert",
    table: tableName,
    values: insertFields,
  });
  return sql;
}

export function getDeleteQuery(tableName, condition) {
  const sql = jsonSql.build({
    type: "remove",
    table: tableName,
    condition,
  });
  return sql;
}

export function getUpdateQuery(tableName, updateFields, condition = {}) {
  const sql = jsonSql.build({
    type: "update",
    table: tableName,
    condition,
    modifier: updateFields,
  });
  return sql;
}

export function getInsertUpdateQuery(tableName, insertFields, updatePlus = {}) {
  const insert = getInsertQuery(tableName, insertFields);
  insert.query = insert.query.substring(0, insert.query.length - 1); // remove ";"
  insert.query += " ON DUPLICATE KEY ";
  const update = getUpdateQuery(tableName, {
    ...insertFields,
    ...updatePlus,
  });
  update.query = update.query.replace(`"${tableName}"`, "");
  update.query = update.query.replace(`update ${tableName} set`, "UPDATE");
  insert.query += update.query;
  insert.values = [...insert.values, ...update.values];
  return insert;
}
