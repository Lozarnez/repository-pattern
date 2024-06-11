const CartService = require('../shared/service/cart.service');

module.exports = {
  createCart: async (req, res, next) => {
    try {
      const { userId } = req.body;
      const cart = await CartService.createCart(userId);
      res.status(201).json(cart);
    } catch (error) {
      next(error);
    }
  },
  addProductToCart: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const product = req.body;
      const cart = await CartService.addProductToCart(userId, product);
      res.customResponse(cart);
    } catch (error) {
      next(error);
    }
  },
  getCartByUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const cart = await CartService.getCartByUser(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  },
};
