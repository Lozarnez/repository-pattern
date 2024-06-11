const dotenv = require('dotenv');
const process = require('process');
const { MongoClient } = require('mongodb');
const { systemLogger } = require('@lib');

dotenv.config();

const connections = [];

const connectToMongoDB = async (name) => {
  const uri = `${process.env.MONGO_URI}`;
  const mongodb = new MongoClient(uri);
  const client = await mongodb.connect(process.env.MONGO_DB);
  const db = client.db();
  connections.push({ name, connection: db });
  systemLogger.info(`Connected to MongoDB: ${name}`);

  return name;
};

const getConnection = (name) => {
  const connection = connections.find((conn) => conn.name === name);
  return connection ? connection.connection : null;
};

module.exports = connectToMongoDB;
module.exports.getConnection = getConnection;
