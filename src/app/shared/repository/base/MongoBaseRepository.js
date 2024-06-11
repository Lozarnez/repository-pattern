const { getConnection } = require('../../db/connection/mongodb.conn');

class MongoBaseRepository {
  #connectionName;
  #collectionName;
  #connection = null;

  constructor(connectionName, collectionName) {
    this.#connectionName = connectionName;
    this.#collectionName = collectionName;
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
    const connection = await this._getConnection();
    const collection = connection.collection(this.collectionName);
    const result = await collection.find().toArray();
    return result;
  }

  async find(query, projection = {}, options = {}) {
    options.page = Number(options.page) || 1;
    options.limit = Number(options.limit) || 10;
    options.skip = options.page ? (options.page - 1) * options.limit : 0;

    const connection = await this.#_getConnection();
    const collection = connection.collection(this.#collectionName);

    const result = await collection
      .find(query, { projection, ...options })
      .toArray();
    const count = await collection.countDocuments(query);
    const totalPages = Math.ceil(count / options.limit);

    return { count, totalPages, result };
  }

  async findOne(query, projection = {}) {
    const connection = await this.#_getConnection();
    const collection = connection.collection(this.#collectionName);
    const result = await collection.findOne(query, projection);
    return result;
  }

  async findById(id) {
    const collection = this.connection.collection(this.collectionName);
    const result = await collection.findOne({ _id: id });
    return result;
  }

  async create(data) {
    const connection = await this.#_getConnection();
    const collection = connection.collection(this.#collectionName);
    const result = await collection.insertOne(data);
    return result.insertedId;
  }

  async update(id, data) {
    const connection = await this.#_getConnection();
    const collection = connection.collection(this.#collectionName);
    const result = await collection.updateOne({ _id: id }, { $set: data });
    return result.modifiedCount;
  }

  async delete(id) {
    const collection = this.connection.collection(this.collectionName);
    const result = await collection.deleteOne({ _id: id });
    return result.deletedCount;
  }
}

module.exports = MongoBaseRepository;
