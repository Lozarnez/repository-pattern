const errorHandlerMiddleware = (error, req, res, _) => {
  const status = error.status || 500;
  const message = error.controlled
    ? error.message
    : 'Ha ocurrido un error. Intente de nuevo más tarde';

  res.header('Content-Type', 'application/json');
  res.customResponse(null, message, status);
};

module.exports = errorHandlerMiddleware;
