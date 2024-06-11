const express = require('express');
const {
  getProductsByCategoryCode,
} = require('../controller/product.controller');

const router = express.Router();

router.get('/category/:categoryCode', getProductsByCategoryCode);

module.exports = router;
