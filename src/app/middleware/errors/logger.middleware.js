const { logger, loggerDb } = require('@lib');

const errorLoggerMiddleware = (error, req, res, next) => {
  loggerDb({
    messageString: error.message,
    additionalInfo: {
      error,
      request: {
        rawHeaders: req.rawHeaders,
        headers: req.headers,
        body: req.body,
        params: req.params,
        query: req.query,
      },
    },
  });

  logger.error(error.message);
  next(error);
};

module.exports = errorLoggerMiddleware;
