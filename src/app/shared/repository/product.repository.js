const BaseRepository = require('./base/MongoBaseRepository');

class ProductRepository extends BaseRepository {
  constructor() {
    super('mongodb', 'Product');
  }

  // Agregar métodos específicos para el repositorio de Product

  /**
   * Encuentra productos por categoría
   * @param {Number} category - Código de categoría
   * @param {Object} projection - Proyección de campos del documento Product.
   * @param {Object} options - Opciones de paginación y filtrado.
   * @param {Number} options.page - Página actual para la paginación.
   * @param {Number} options.limit - Límite de documentos por página.
   * @param {Number} [options.skip] - Cantidad de documentos a omitir para la paginación.
   * @returns {Promise<{count: Number, totalPages: Number, result: Array}>}
   * @memberof ProductRepository
   * @example
   * const products = await ProductRepository.findByCategory(1, { page: 1, limit: 10 });
   */
  async findByCategory(category, projection, options) {
    const categoryCode = Number(category);
    return this.find({ categoryCode }, projection, options);
  }
}

module.exports = new ProductRepository();
