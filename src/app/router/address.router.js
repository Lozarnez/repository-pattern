const express = require('express');
const { getAddress } = require('@controller/address.controller');

const router = express.Router();

router.get('/', getAddress);

module.exports = router;
