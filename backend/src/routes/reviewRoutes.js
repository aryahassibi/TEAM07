// routes for review submission and fetching approved reviews

/*
// version with middleware
const express = require('express');
const router = express.Router();
const { submitReview, getApprovedReviews } = require('../controllers/reviewController');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware');

// Route to submit a review (only accessible to logged-in users)
router.post('/submit', authenticationMiddleware, submitReview);

// Route to fetch all approved reviews for a specific product
router.get('/:product_id/approved', getApprovedReviews);

module.exports = router;
*/

// no middleware version
const express = require('express');
const router = express.Router();
const { submitReview, getApprovedReviews } = require('../controllers/reviewController');

// Route to submit a review
router.post('/submit', submitReview);

// Route to fetch all approved reviews for a specific product
router.get('/:product_id/approved', getApprovedReviews);

module.exports = router;
