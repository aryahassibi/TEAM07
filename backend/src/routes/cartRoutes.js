const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/:user_id', cartController.getCartItems);
router.post('/add', cartController.addItemToCart);
router.put('/update', cartController.updateCartItemQuantity);

module.exports = router;

