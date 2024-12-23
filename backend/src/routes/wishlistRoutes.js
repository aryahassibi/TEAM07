const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/wishlist', wishlistController.getWishlistVariants);

module.exports = router;
