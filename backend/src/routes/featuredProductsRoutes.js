const express = require('express');
const router = express.Router();
const mysql = require("mysql2");
const db = require('../config/db'); // Import your database connection

router.get('/featuredproducts', (req, res) => {
  const query = `
    SELECT 
      p.product_id AS id,
      p.name,
      COALESCE(AVG(average_rating), 0) AS rating,
      MIN(v.price) AS price,
      i.image_url AS image
    FROM Products p
    JOIN Product_Variant v ON p.product_id = v.product_id
    JOIN Product_Images i ON v.variant_id = i.variant_id
    GROUP BY p.product_id, i.image_url
    ORDER BY p.product_id ASC
    LIMIT 4;
  `;

  console.log('Executing query:', query);
  db.query(query, (err, results) => {
    if (err) {
        console.error('Database error:', err);
        res.status(500).send('Database Error');
    } else {
        console.log('Query results:', results);
        res.json(results);
    }
  });
});

module.exports = router;
