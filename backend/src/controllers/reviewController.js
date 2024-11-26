const mysql = require("mysql2");

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected");
});

// Submit Review Controller
const submitReview = async (req, res) => {
    try {
      const { product_id, user_id, rating, content } = req.body;

      // Input validation
      if (!product_id || !user_id || !rating || !content) {
        return res.status(400).json({ message: 'All fields are required: product_id, user_id, rating, content.' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }
      
      // Insert the review into the database
      const query = `
        INSERT INTO Comments (product_id, user_id, rating, content, approved) 
        VALUES (?, ?, ?, ?, FALSE)
      `;
      await db.execute(query, [product_id, user_id, rating, content]);

      res.status(201).json({ message: 'Review submitted successfully. It is pending approval.' });
    } catch (error) {
      console.error('Error submitting review:', error.message);
      res.status(500).json({ message: 'An error occurred while submitting the review.' });
    }
};

// Fetch all approved reviews for a specific product
const getApprovedReviews = async (req, res) => {
    const { product_id } = req.params;

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
      // Query to get approved reviews for the specified product
      const query = `
        SELECT c.comment_id, c.product_id, c.user_id, c.rating, c.content, c.created_at, u.username, u.email
        FROM Comments c
        JOIN Users u ON c.user_id = u.user_id
        WHERE c.product_id = ? AND c.approved = TRUE
        ORDER BY c.created_at DESC;
      `;

      const [reviews] = await db.execute(query, [product_id]);

      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No approved reviews found for this product.' });
      }

      res.status(200).json({ reviews });
    } catch (error) {
      console.error('Error fetching approved reviews:', error.message);
      res.status(500).json({ message: 'An error occurred while fetching approved reviews.' });
    }
};
  
// Function for managers to approve or reject a review
const approveRejectReview = async (req, res) => {
    const { review_id } = req.params; // Review ID from URL
    const { action } = req.body; // Manager action must be either 'approve' or 'reject'

    try {
        // Check if an action is provided (approve or reject)
        if (action) {
            if (action !== 'approve' && action !== 'reject') {
                return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
            }

            const approved = action === 'approve';

            // Update the review status if it is pending (approved = FALSE)
            const [result] = await db.execute(
                'UPDATE Comments SET approved = ? WHERE comment_id = ? AND approved = FALSE',
                [approved, review_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Review not found or already approved/rejected.' });
            }

            return res.status(200).json({
                message: `Review ${approved ? 'approved' : 'rejected'} successfully.`,
            });
        }

        // If no action is provided, fetch pending reviews
        const [rows] = await db.execute(
            'SELECT * FROM Comments WHERE approved = FALSE'
        );

        res.status(200).json({ pending_reviews: rows });

    } catch (error) {
        console.error('Error managing reviews:', error.message);
        res.status(500).json({ message: 'Failed to manage reviews.' });
    }
};

module.exports = { 
    submitReview,
    getApprovedReviews,
    approveRejectReview
};
