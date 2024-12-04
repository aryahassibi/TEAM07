exports.searchProducts = (req, res) => {
    const { search = '', sort_by = 'price', sort_order = 'asc' } = req.query;

    // Validate sorting parameters
    const validSortBy = ['price', 'average_rating']; // Include average_rating for sorting
    const validSortOrder = ['asc', 'desc'];

    if (!validSortBy.includes(sort_by) || !validSortOrder.includes(sort_order.toLowerCase())) {
        return res.status(400).json({ error: "Invalid sorting parameters" });
    }

    // Split search terms
    const searchTerms = search.trim().split(' ').filter(Boolean);

    // Build the WHERE clause and query parameters
    let whereClause = '';
    let queryParams = [];

    if (searchTerms.length > 0) {
        whereClause = searchTerms.map(term => {
            queryParams.push(`%${term}%`, `%${term}%`);
            return `(p.name LIKE ? OR p.description LIKE ?)`;
        }).join(' OR ');
    } else {
        // If no search terms provided, return an empty result
        return res.json({ data: [], total: 0 });
    }

    // Use COALESCE to handle NULL values for average_rating
    const sortColumn = sort_by === 'average_rating' ? 'COALESCE(p.average_rating, 0)' : 'pv.price';

    // Build the query
    // Updated SELECT query with dynamic average_rating calculation
    const query = `
    SELECT 
        p.product_id, 
        p.name, 
        p.category_id,
        p.roast_level, 
        p.bean_type, 
        p.grind_type, 
        p.caffeine_content, 
        p.origin, 
        pv.variant_id, 
        pv.weight_grams, 
        pv.price, 
        pv.stock, 
        pv.sku, 
        COALESCE(AVG(r.rating), 0) AS average_rating, 
        (pv.stock = 0) AS out_of_stock 
    FROM Products p
    LEFT JOIN Product_Variant pv ON p.product_id = pv.product_id
    LEFT JOIN Reviews r ON p.product_id = r.product_id
    WHERE ${whereClause}
    GROUP BY p.product_id, pv.variant_id
    ORDER BY ${sortColumn} ${sort_order.toUpperCase()}
    `;


    // Execute the query
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error("Error executing search query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        res.json({ data: results, total: results.length });
    });
};
