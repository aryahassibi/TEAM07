// routes for managers to edit review status

/*
// version with middleware
const express = require('express');
const router = express.Router();
const { approveRejectReview } = require('../controllers/reviewController'); // Updated controller function
const authorizationMiddleware = require('../middlewares/authorizationMiddleware'); // Import the authorization middleware

// Route to fetch pending reviews or approve/reject a review (only accessible by managers)
router.route('/reviews/pending')
  .get(authorizationMiddleware, approveRejectReview) // Fetch pending reviews
  .patch(authorizationMiddleware, approveRejectReview); // Approve or reject a review

module.exports = router;
*/

// no middleware version
const express = require('express');
const router = express.Router();
const { approveRejectReview } = require('../controllers/reviewController');

// Route to fetch pending reviews or approve/reject a review
router.route('/reviews/pending')
  .get(approveRejectReview) // Fetch pending reviews
  .patch(approveRejectReview); // Approve or reject a review

module.exports = router;
