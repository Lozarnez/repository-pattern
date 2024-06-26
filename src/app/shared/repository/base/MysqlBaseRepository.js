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

  /**
   * Method to find data from the database
   * @param {object} query - Query object to filter the data
   * @param {object} projection - Projection object to select the fields
   * @param {object} options - Options object to paginate the data
   * @param {number} options.page - Page number to fetch the data
   * @param {number} options.limit - Limit to fetch the data
   * @returns {Promise<object>} - Returns the data from the database
   * @example
   * const query = { status: 1 };
   * const projection = { id: 1, zip: 1, street: 1 };
   * const options = { page: 2, limit: 5 };
   * const address = await AddressRepository.find(query, projection, options);
   */
  async find(query, projection = {}, options = {}) {
    options.page = Number(options.page) || 1;
    options.limit = Number(options.limit) || 10;
    options.skip = options.page ? (options.page - 1) * options.limit : 0;

    const connection = await this.#_getConnection();
    const selectClause = Object.keys(projection).length
      ? Object.keys(projection).join(', ')
      : '*';
    const whereClause = Object.keys(query)
      .map((key) => `${key} = ?`)
      .join(' AND ');
    const whereValues = Object.values(query);

    const [rows] = await connection.query(
      `SELECT ${selectClause} FROM ${this.#tableName} WHERE ${whereClause} LIMIT ? OFFSET ?`,
      [...whereValues, options.limit, options.skip],
    );

    const [countResult] = await connection.query(
      `SELECT COUNT(*) as count FROM ${this.#tableName} WHERE ${whereClause}`,
      whereValues,
    );

    const count = countResult[0].count;
    const totalPages = Math.ceil(count / options.limit);

    return { count, totalPages, result: rows };
  }

  /**
   *
   * @param {} query
   * @param {*} projection
   * @returns
   */
  async findOne(query, projection = {}) {
    const connection = await this.#_getConnection();
    const selectClause = Object.keys(projection).length
      ? Object.keys(projection).join(', ')
      : '*';
    const whereClause = Object.keys(query)
      .map((key) => `${key} = ?`)
      .join(' AND ');
    const whereValues = Object.values(query);

    const [rows] = await connection.query(
      `SELECT ${selectClause} FROM ${this.#tableName} WHERE ${whereClause} LIMIT 1`,
      whereValues,
    );

    return rows.length ? rows[0] : null;
  }

  async findAll() {
    const connection = await this.#_getConnection();
    const result = await connection.query(`SELECT * FROM ${this.#tableName}`);
    return result;
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
