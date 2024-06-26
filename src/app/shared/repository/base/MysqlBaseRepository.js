const schemaValidator = require('../../resource/schemaValidator');
const { AddressSchema } = require('@schema');
const { getMySQLConnection } = require('@db/connection');

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
      this.#connection = await getMySQLConnection(this.#connectionName);
      if (!this.#connection) {
        throw new Error(`Connection ${this.#connectionName} not found`);
      }
    }
    return this.#connection;
  }

  /**
   * Method to create data in the database
   * @param {object} data - Data to be inserted in the database
   * @returns {Promise<number>} - Returns the id of the inserted data
   */
  async create(data) {
    const [isValid, errors] = schemaValidator(AddressSchema.validate, data);
    if (!isValid) {
      return errors;
    }

    const requiredFields = Object.keys(AddressSchema.schema.properties).filter(
      (key) => AddressSchema.schema.required.includes(key),
    );
    const optionalFields = Object.keys(AddressSchema.schema.properties).filter(
      (key) => !AddressSchema.schema.required.includes(key),
    );

    const fields = [
      ...requiredFields,
      ...optionalFields.filter((key) => key in data),
    ];
    const values = fields.map((field) => data[field]);

    const placeholders = fields.map(() => '?').join(', ');
    const columns = fields.join(', ');
    const query = `INSERT INTO ${this.#tableName} (${columns}) VALUES (${placeholders})`;

    const connection = await this.#_getConnection();
    const [result] = await connection.query(query, values);
    return result.insertId;
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
   * Method to update data in the database
   * @param {object} query - Query object to filter the data
   * @param {object} data - Data to be updated in the database
   * @returns {Promise<boolean>} - Returns true if the data is updated
   */
  async update(query, data) {
    const [isValid, errors] = schemaValidator(
      AddressSchema.partialSchema,
      data,
    );
    if (!isValid) {
      return errors;
    }

    const setFields = Object.keys(data);
    const setValues = setFields.map((field) => data[field]);
    const setClause = setFields.map((field) => `${field} = ?`).join(', ');
    const whereFields = Object.keys(query);
    const whereValues = whereFields.map((field) => query[field]);
    const whereClause = whereFields
      .map((field) => `${field} = ?`)
      .join(' AND ');

    const queryString = `UPDATE ${this.#tableName} SET ${setClause} WHERE ${whereClause}`;

    const connection = await this.#_getConnection();
    const [result] = await connection.query(queryString, [
      ...setValues,
      ...whereValues,
    ]);

    return result.changedRows > 0;
  }

  /**
   * Method to delete data from the database
   * @param {object} query - Query object to filter the data
   * @returns {Promise<boolean>} - Returns true if the data is deleted
   */
  async delete(query) {
    const whereFields = Object.keys(query);
    const whereValues = whereFields.map((field) => query[field]);

    const whereClause = whereFields
      .map((field) => `${field} = ?`)
      .join(' AND ');

    const queryString = `DELETE FROM ${this.#tableName} WHERE ${whereClause}`;

    const connection = await this.#_getConnection();
    const [result] = await connection.execute(queryString, whereValues);

    return result.affectedRows > 0;
  }

  /**
   *
   * @param {object} query - Query object to filter the data
   * @param {object} projection - Projection object to select the fields
   * @returns {Promise<object>} - Returns the data from the database
   * @example
   * const query = { id: 1 };
   * const projection = { id: 1, zip: 1, street: 1 };
   * const address = await AddressRepository.findOne(query, projection);
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
