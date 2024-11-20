const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:user_id', cartController.getCartItems);

module.exports = router;

