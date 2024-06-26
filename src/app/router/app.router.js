const AddressRouter = require('./address.router');
const CartRouter = require('./cart.router');
const ProductRouter = require('./product.router');
const UserRouter = require('./user.router');

module.exports = (prefix, app) => {
  app.use(`${prefix}/products`, ProductRouter);
  app.use(`${prefix}/carts`, CartRouter);
  app.use(`${prefix}/users`, UserRouter);
  app.use(`${prefix}/address`, AddressRouter);
};
