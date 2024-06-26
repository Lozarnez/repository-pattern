const AddressService = require('@service/address.service');

module.exports = {
  getAddress: async (req, res, next) => {
    try {
      const { page, limit } = req.query;
      const address = await AddressService.getAddress({ page, limit });
      res.customResponse(address);
    } catch (error) {
      next(error);
    }
  },
};
