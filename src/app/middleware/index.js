const errorHandler = require('./errors/handler.middleware');
const errorLogger = require('./errors/logger.middleware');
const errorRoute = require('./errors/invalidRoute.middleware');
const responseHandler = require('./responseHandler.middleware');
const schemaValidator = require('./schemaValidator.middleware');

module.exports = {
  errorLogger,
  errorHandler,
  errorRoute,
  responseHandler,
  schemaValidator,
};
