const { STATUS_CODES } = require('http');

const isValidStatus = (status) => {
  return STATUS_CODES[status] !== undefined;
};

const customError = (
  status = 400,
  message = 'Ha ocurrido un error inesperado',
) => {
  let msg = message;
  let statusCode = status;

  if (typeof status !== 'number') {
    msg = status;
    statusCode = 400;
  }

  if (!isValidStatus(statusCode)) {
    throw new Error('Invalid status code');
  }

  const error = new Error(msg);
  error.status = status;
  error.controlled = true;

  throw error;
};

module.exports = customError;
