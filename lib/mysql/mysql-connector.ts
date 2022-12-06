import { MysqlTable } from "./mysql-table";
import mysql from "mysql2/promise";
import { ConnectionOptions } from "mysql2";

export class MysqlConnector {
  alive = true;
  connection;
  connectionName;

  constructor(config: ConnectionOptions, connectionName = undefined) {
    this.connection = mysql.createPool(config);
    this.connectionName = connectionName;
    this.alive = true;
  }

  async query(sql, args = []) {
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

  getTable(tableName) {
    return new MysqlTable(this, tableName);
  }

  get(tableName) {
    return this.getTable(tableName);
  }
}

interface IMysqlConnector {
  getTable(tableName): MysqlTable;
}

export class MagicTable {
  target: MysqlConnector;
  people: MysqlTable;
  constructor(target) {
    this.target = target;
    return new Proxy(target, this);
  }

  get(target, prop) {
    return this[prop] || this.target.getTable(prop);
  }
}
