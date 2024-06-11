require('winston-mongodb');
const dotenv = require('dotenv');
const process = require('process');
const winston = require('winston');

dotenv.config();

const DBLoggerOptions = {
  db: process.env.MONGO_URI,
  options: { useUnifiedTopology: true },
  collection: 'logs',
  storeHost: true,
  leaveConnectionOpen: false,
  capped: true,
  cappedMax: 100000,
  format: winston.format.combine(
    winston.format.json(),
    winston.format.colorize({ all: false }),
    winston.format.metadata({ key: 'additionalInfo' }),
  ),
  metaKey: 'additionalInfo',
};

const DBLogger = winston.createLogger({
  transports: [new winston.transports.MongoDB(DBLoggerOptions)],
});

const loggerDb = async ({
  messageString = '',
  additionalInfo = { error: null, request: null },
  type = 'error',
}) => {
  DBLogger[type]({
    message: messageString,
    error: additionalInfo?.error,
    request: additionalInfo?.request,
  });
};

const systemLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.printf(({ message }) => `[System]: ${message}`),
    winston.format.colorize({ all: true }),
  ),
  transports: [new winston.transports.Console()],
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize({ all: true }),
  ),
  transports: [new winston.transports.Console()],
});

module.exports = { systemLogger, loggerDb, logger };
