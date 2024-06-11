const express = require('express');
const {
  createCart,
  addProductToCart,
  getCartByUser,
} = require('@controller/cart.controller');
const { productInCartSchema } = require('@schema/cart.schema');
const { schemaValidator } = require('@middleware');

const router = express.Router();

router.post('/', createCart);
router.post('/:userId', schemaValidator(productInCartSchema), addProductToCart);
router.get('/:userId', getCartByUser);

module.exports = router;
