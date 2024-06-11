const UserService = require('../shared/service/user.service');

module.exports = {
  getUserByEmail: async (req, res, next) => {
    try {
      const { email } = req.params;
      const user = await UserService.getUserByEmail(email);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  getUserOrders: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const orders = await UserService.getUserOrders(userId);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  },
};
