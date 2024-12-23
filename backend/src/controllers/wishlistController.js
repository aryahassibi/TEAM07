const db = require('../config/db'); // Assume this is the database connection pool

// Get all product variants in the wishlist of a user
exports.getWishlistVariants = (req, res) => {
    // const userId = req.user?.id; // Assume `req.user` contains authenticated user info
    const userId = req.user.user_id; 

    if (!userId) {
        return res.status(401).json({ error: 'User is not authenticated.' });
    }

    const query = `
        SELECT 
            p.product_id,
            p.name,
            p.average_rating,
            p.origin,
            p.roast_level,
            p.bean_type,
            p.grind_type,
            p.caffeine_content,
            pv.variant_id,
            pv.weight_grams,
            pv.price,
            pv.stock,
            pv.sku,
            CASE
                WHEN d.discount_id IS NULL OR d.active = 0
                    OR (d.start_date IS NOT NULL AND d.start_date > CURDATE())
                    OR (d.end_date IS NOT NULL AND d.end_date < CURDATE())
                THEN pv.price
                WHEN d.discount_type = 'percentage'
                    THEN (pv.price * GREATEST(0, 1 - (d.value / 100)))
                WHEN d.discount_type = 'fixed'
                    THEN GREATEST(0, pv.price - d.value)
                ELSE
                    pv.price
            END AS effective_price
        FROM Wishlist w
        JOIN WishlistItems wi ON w.wishlist_id = wi.wishlist_id
        JOIN Product_Variant pv ON wi.variant_id = pv.variant_id
        JOIN Products p ON pv.product_id = p.product_id
        LEFT JOIN Discounts d ON d.variant_id = pv.variant_id
            AND d.active = 1
            AND (d.start_date IS NULL OR d.start_date <= CURDATE())
            AND (d.end_date IS NULL OR d.end_date >= CURDATE())
        WHERE w.user_id = ?
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving wishlist variants:', error.message);
            return res.status(500).json({ error: 'Failed to retrieve wishlist.' });
        }

        res.json(results);
    });
};