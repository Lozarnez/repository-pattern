/* eslint-disable no-unused-vars */
const { getConnection } = require('../../db/connection/mysql.conn');

class MysqlBaseRepository {
  #connectionName;
  #tableName;
  #connection = null;

  constructor(connectionName, tableName) {
    this.#connectionName = connectionName;
    this.#tableName = tableName;
  }

  async #_getConnection() {
    if (!this.#connection) {
      this.#connection = await getConnection(this.#connectionName);
      if (!this.#connection) {
        throw new Error(`Connection ${this.#connectionName} not found`);
      }
    }
    return this.#connection;
  }

  async findAll() {
    const connection = await this.#_getConnection();
    const result = await connection.query(`SELECT * FROM ${this.#tableName}`);
    return result;
  }

  async find(query, projection = {}, options = {}) {
    options.page = Number(options.page) || 1;
    options.limit = Number(options.limit) || 10;
    options.skip = options.page ? (options.page - 1) * options.limit : 0;

    const connection = await this.#_getConnection();
    const result = await connection.query(
      `SELECT * FROM ${this.#tableName} WHERE ?`,
      query,
    );
    const count = result.length;
    const totalPages = Math.ceil(count / options.limit);

    return { count, totalPages, result };
  }

  async findOne(query, projection = {}) {
    const connection = await this.#_getConnection();
    const result = await connection.query(
      `SELECT * FROM ${this.#tableName} WHERE ?`,
      query,
    );
    return result[0];
  }

  async findById(id) {
    const connection = await this.#_getConnection();
    const result = await connection.query(
      `SELECT * FROM ${this.#tableName} WHERE ?`,
      { id },
    );
    return result[0];
  }

  async create(data) {
    const connection = await this.#_getConnection();
    const result = await connection.query(
      `INSERT INTO ${this.#tableName} SET ?`,
      data,
    );
    return result;
  }

  async update(id, data) {
    const connection = await this.#_getConnection();
    const result = await connection.query(
      `UPDATE ${this.#tableName} SET ? WHERE ?`,
      [data, { id }],
    );
    return result;
  }

  async delete(id) {
    const connection = await this.#_getConnection();
    const result = await connection.query(
      `DELETE FROM ${this.#tableName} WHERE ?`,
      { id },
    );
    return result;
  }

  async findWithJoin(joins, query = {}, projection = {}, options = {}) {
    options.page = Number(options.page) || 1;
    options.limit = Number(options.limit) || 10;
    options.skip = options.page ? (options.page - 1) * options.limit : 0;

    const connection = await this.#_getConnection();
    const sqlQuery = this.#buildJoinQuery(joins, query, projection, options);

    const [result, countResult] = await Promise.all([
      connection.query(sqlQuery.query, sqlQuery.values),
      connection.query(sqlQuery.countQuery, sqlQuery.values),
    ]);

    const count = countResult.length ? countResult[0].total_count : 0;
    const totalPages = Math.ceil(count / options.limit);

    return { count, totalPages, result: result[0] };
  }

  #buildJoinQuery(joins, query, projection, options) {
    let selectColumns = '*';
    if (projection && Object.keys(projection).length > 0) {
      selectColumns = Object.keys(projection)
        .map((field) => `${field} AS ${projection[field]}`)
        .join(', ');
    }

    let sqlQuery = `SELECT ${selectColumns} FROM ${this.#tableName}`;
    let countQuery = `SELECT COUNT(*) AS total_count FROM ${this.#tableName}`;

    joins.map((join, index) => {
      const joinTable = join.table;
      const joinOn = join.on;
      const joinAlias = join.alias ? `AS ${join.alias}` : join.table;
      const joinType = join.type || 'LEFT'; // Default LEFT JOIN

      sqlQuery += ` ${joinType} JOIN ${joinTable} ${joinAlias} ON ${joinOn}`;
      countQuery += ` ${joinType} JOIN ${joinTable} ${joinAlias} ON ${joinOn}`;

      return { joinTable, joinAlias, index };
    });

    const whereClause = this.#buildWhereClause(query);
    sqlQuery += whereClause;
    countQuery += whereClause;

    sqlQuery += ` LIMIT ${options.skip}, ${options.limit}`;

    const values = Object.values(query);

    return { query: sqlQuery, countQuery, values };
  }

  #buildWhereClause(query) {
    if (!query || Object.keys(query).length === 0) {
      return '';
    }

    const whereConditions = Object.keys(query)
      .map((key) => `${key} = ?`)
      .join(' AND ');

    return ` WHERE ${whereConditions}`;
  }
}

module.exports = MysqlBaseRepository;
