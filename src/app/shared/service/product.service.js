const ProductRepository = require('../repository/product.repository');

const getProductsByCategoryCode = async (categoryCode, options) => {
  const { page, limit } = options; // Sólo se está usando la opción de paginación
  return ProductRepository.findByCategory(
    categoryCode,
    { name: 1 },
    { page, limit },
  );
};

module.exports = {
  getProductsByCategoryCode,
};
