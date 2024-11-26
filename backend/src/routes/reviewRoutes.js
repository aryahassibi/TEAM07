// routes for review submission and fetching approved reviews
const express = require('express');
const router = express.Router();
const { submitReview, getApprovedReviews } = require('../controllers/reviewController');

// Middleware to validate product_id
const validateProductId = (req, res, next) => {
  const { product_id } = req.params;
  if (!/^\d+$/.test(product_id)) { // Check if product_id is a positive integer
    return res.status(400).json({ message: 'Invalid Product ID format' });
  }
  next();
};

// Route for missing product_id
router.get('/approved', (req, res) => {
    res.status(400).json({ message: 'Product ID is required' });
});

// Route to submit a review
router.post('/submit', submitReview);

// Route to fetch all approved reviews for a specific product
router.get('/:product_id/approved', validateProductId, getApprovedReviews);

module.exports = router;
