const express = require('express');
const {
  getUserByEmail,
  getUserOrders,
} = require('../controller/user.controller');

const router = express.Router();

router.get('/search-by-email/:email', getUserByEmail);
router.get('/search-orders/:userId', getUserOrders);

module.exports = router;
