const ProductRepository = require('@repository/product.repository');
const UserRepository = require('../repository/user.repository');

const getUserByEmail = async (email) => {
  return UserRepository.findByEmail(email);
};

const getUserOrders = async (userId) => {
  const orders = await UserRepository.findUserOrders(userId);
  for (let i = 0; i < orders.result.length; i++) {
    const order = orders.result[i];
    const products = await ProductRepository.find(
      { code: order.productCode },
      { name: 1, price: 1, _id: 0 },
      {},
    );
    orders.result[i].products = products.result;
  }

  return orders;
};

module.exports = {
  getUserByEmail,
  getUserOrders,
};
