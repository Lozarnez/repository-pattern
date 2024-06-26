const MongoConnection = require('./mongodb.conn');
const MySQLConnection = require('./mysql.conn');

module.exports = {
  MongoConnection,
  MySQLConnection,
  getMySQLConnection: MySQLConnection.getConnection,
  closeMySQLConnection: MySQLConnection.closeConnection,
};
