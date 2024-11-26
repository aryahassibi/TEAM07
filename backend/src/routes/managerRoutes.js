// routes for managers to edit review status
const express = require('express');
const router = express.Router();
const { approveRejectReview } = require('../controllers/reviewController');

// Route to approve/reject a specific review
router.patch('/reviews/:review_id', approveRejectReview);

// Route to fetch pending reviews
router.get('/pending', approveRejectReview);

module.exports = router;