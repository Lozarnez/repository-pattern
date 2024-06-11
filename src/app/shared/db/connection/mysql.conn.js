const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const process = require('process');
const { systemLogger } = require('@lib');

dotenv.config();

const connections = [];

const connectToMySQL = async (name) => {
  const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  });
  const db = await connection.getConnection();
  connections.push({ name, connection });
  systemLogger.info(`Connected to MySQL: ${name}`);

  return db;
};

const getConnection = (name) => {
  const connection = connections.find((conn) => conn.name === name);
  return connection.connection;
};

module.exports = connectToMySQL;
module.exports.getConnection = getConnection;
