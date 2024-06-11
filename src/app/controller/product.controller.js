const ProductService = require('../shared/service/product.service');

module.exports = {
  getProductsByCategoryCode: async (req, res, next) => {
    try {
      const { categoryCode } = req.params;
      const { page, limit } = req.query;
      const products = await ProductService.getProductsByCategoryCode(
        categoryCode,
        { page, limit },
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
};
