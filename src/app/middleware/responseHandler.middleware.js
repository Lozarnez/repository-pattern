const { STATUS_CODES } = require('http');

module.exports = (req, res, next) => {
  res.customResponse = (data, message = 'Ok', statusCode = 200) => {
    if (STATUS_CODES[statusCode] === undefined) {
      throw new Error('Invalid status code');
    }

    const response = {
      success: statusCode >= 200 && statusCode < 300,
      message: message,
      data: data || null,
    };

    res.status(statusCode).json(response);
  };
  next();
};
