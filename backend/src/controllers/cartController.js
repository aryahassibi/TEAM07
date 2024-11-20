
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// GET endpoint to fetch cart items
exports.getCartItems = (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT ci.product_id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS subtotal
    FROM ShoppingCartItems ci
    JOIN Products p ON ci.product_id = p.product_id
    WHERE ci.cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ? LIMIT 1)
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error retrieving cart items:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const total = results.reduce((sum, item) => sum + item.subtotal, 0);
    res.json({ items: results, total });
  });
};