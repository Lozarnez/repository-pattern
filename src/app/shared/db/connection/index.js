const MongoConnection = require('./mongodb.conn');
const MySQLConnection = require('./mysql.conn');

module.exports = {
  MongoConnection,
  MySQLConnection,
  closeMySQLConnection: MySQLConnection.closeConnection,
};
