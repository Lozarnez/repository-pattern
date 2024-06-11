const CartRepository = require('../repository/cart.repository');

const createCart = async (userId) => {
  return await CartRepository.createCart(userId);
};

const addProductToCart = async (userId, product) => {
  return await CartRepository.addProductToCart(userId, product);
};

const getCartByUser = async (userId) => {
  return await CartRepository.findByUser(userId);
};

module.exports = {
  createCart,
  addProductToCart,
  getCartByUser,
};
