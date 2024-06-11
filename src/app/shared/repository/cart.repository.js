const BaseRepository = require('./base/MongoBaseRepository');

class CartRepository extends BaseRepository {
  constructor() {
    super('mongodb', 'Cart');
  }

  #ActionType = {
    NEW_CART: 'NEW_CART',
    ADD_PRODUCT: 'ADD_PRODUCT',
    UPDATE_QUANTITY: 'UPDATE_QUANTITY',
    REMOVE_PRODUCT: 'REMOVE_PRODUCT',
    BUY_CART: 'BUY_CART',
  };

  #createAction(actionType, payload) {
    switch (actionType) {
      case this.#ActionType.NEW_CART:
        return { action: actionType };
      case this.#ActionType.ADD_PRODUCT:
        return { action: actionType, product: payload };
      case this.#ActionType.UPDATE_QUANTITY:
        return { action: actionType, product: payload };
      case this.#ActionType.REMOVE_PRODUCT:
        return { action: actionType, product: payload };
      case this.#ActionType.BUY_CART:
        return { action: actionType, products: payload };
      default:
        throw new Error('Invalid action type');
    }
  }

  #addToCartHistory(cart, actionType, payload) {
    const action = this.#createAction(actionType, payload);
    const historyItem = { ...action, date: new Date().toISOString() };
    cart.historial.push(historyItem);
  }

  async createCart(userId) {
    const cart = { userId, products: [], historial: [], status: 'active' };
    this.#addToCartHistory(cart, this.#ActionType.NEW_CART);
    return this.create(cart);
  }

  async addProductToCart(userId, product) {
    const id = Number(userId);
    const cart = await this.findOne({ userId: id });
    if (!cart) {
      return this.createCart(userId);
    }
    const productIndex = cart.products.findIndex(
      (p) => p.productId === product.productId,
    );

    if (productIndex === -1) {
      cart.products.push(product);
      this.#addToCartHistory(cart, this.#ActionType.ADD_PRODUCT, product);
    } else {
      cart.products[productIndex].quantity += product.quantity;
      this.#addToCartHistory(cart, this.#ActionType.UPDATE_QUANTITY, product);
    }

    return this.update(cart._id, cart);
  }

  async findByUser(userId) {
    return this.find({ userId });
  }
}

module.exports = new CartRepository();
