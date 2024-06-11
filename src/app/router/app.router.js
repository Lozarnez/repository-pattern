const CartRouter = require('./cart.router');
const ProductRouter = require('./product.router');
const UserRouter = require('./user.router');

module.exports = (prefix, app) => {
  app.use(`${prefix}/products`, ProductRouter);
  app.use(`${prefix}/carts`, CartRouter);
  app.use(`${prefix}/users`, UserRouter);
};
