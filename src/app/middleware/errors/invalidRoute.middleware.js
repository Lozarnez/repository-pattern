const invalidRouteMiddleware = (req, res) => {
  res.status(404).send({ success: false, message: 'Invalid route' });
};

module.exports = invalidRouteMiddleware;
