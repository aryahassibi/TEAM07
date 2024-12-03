const mysql = require('mysql2');
const { authMiddleware } = require('../middleware/authMiddleware');

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

// Controller Functions

// Get all approved reviews for a product
exports.getReviewsByProduct = (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    const query = `
        SELECT c.comment_id, c.rating, c.content, c.created_at, u.first_name, u.last_name
        FROM Comments c
        JOIN Users u ON c.user_id = u.user_id
        WHERE c.product_id = ? AND c.approved = TRUE
        ORDER BY c.created_at DESC
    `;

    db.query(query, [product_id], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ reviews: results });
    });
};

exports.getPendingReviews = (req, res) => {
    const query = `
        SELECT c.comment_id, c.rating, c.content, c.created_at, u.first_name, u.last_name
        FROM Comments c
        JOIN Users u ON c.user_id = u.user_id
        WHERE c.approved = FALSE
        ORDER BY c.created_at DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching pending reviews:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(200).json({ reviews: results });
    });
};

exports.rejectReview = (req, res) => {
    const { comment_id } = req.params;

    const query = `DELETE FROM Comments WHERE comment_id = ? AND approved = FALSE`;

    db.query(query, [comment_id], (err, result) => {
        if (err) {
            console.error('Error rejecting review:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found or already approved' });
        }

        res.status(200).json({ message: 'Review rejected successfully.' });
    });
};


// Add a new review
exports.addReview = (req, res) => {
    const { product_id, rating, content } = req.body;
    const user_id = req.user?.user_id;

    console.log("Add review request:", { product_id, user_id, rating, content });

    if (!product_id || !rating || !content) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const query = `
        INSERT INTO Comments (product_id, user_id, rating, content)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [product_id, user_id, rating, content], (err) => {
        if (err) {
            console.error("Error adding review:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        res.status(201).json({ message: "Review submitted successfully. Awaiting approval." });
    });
};

// Approve a review (Admin-only)
exports.approveReview = (req, res) => {
    const { comment_id } = req.params;

    const query = `
        UPDATE Comments SET approved = TRUE WHERE comment_id = ?
    `;

    db.query(query, [comment_id], (err, result) => {
        if (err) {
            console.error('Error approving review:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review approved successfully.' });
    });
};

// Delete a review (Admin or the user who wrote the review)
exports.deleteReview = (req, res) => {
    const { comment_id } = req.params;

    const query = `
        DELETE FROM Comments WHERE comment_id = ? AND (user_id = ? OR ? = 'admin')
    `;

    const user_id = req.user.user_id;
    const role = req.user.role || 'user';

    db.query(query, [comment_id, user_id, role], (err, result) => {
        if (err) {
            console.error('Error deleting review:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found or unauthorized action' });
        }

        res.status(200).json({ message: 'Review deleted successfully.' });
    });
};
