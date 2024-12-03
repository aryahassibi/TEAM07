const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.get('/pending', authMiddleware, reviewsController.getPendingReviews);
router.post('/', authMiddleware, reviewsController.addReview);
router.put('/approve/:comment_id', authMiddleware, reviewsController.approveReview);
router.delete('/reject/:comment_id', authMiddleware, reviewsController.rejectReview);

module.exports = router;
