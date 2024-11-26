// routes/checkoutRoutes.js
const express = require('express');
const { validateCart, finalizeCheckout } = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validate stock and calculate total price
router.post('/validate-cart', authMiddleware, validateCart);

// Finalize checkout
router.post('/finalize-checkout', authMiddleware, finalizeCheckout);

module.exports = router;
