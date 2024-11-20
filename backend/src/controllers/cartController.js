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
            console.error("Error retrieving cart items:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        const total = results.reduce((sum, item) => sum + item.subtotal, 0);
        res.json({ items: results, total });
    });
};

// POST endpoint to add an item to the cart with stock check
exports.addItemToCart = (req, res) => {
    const { user_id, variant_id, quantity } = req.body;

    const checkStockQuery =
        "SELECT quantity FROM Product_Variant WHERE variant_id = ?";
    db.query(checkStockQuery, [variant_id], (err, results) => {
        if (err) {
            console.error("Error checking stock:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!results.length || results[0].quantity < quantity) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        const addToCartQuery = `
            INSERT INTO Cart_Items (cart_id, variant_id, quantity)
            VALUES (
                (SELECT cart_id FROM ShoppingCart WHERE user_id = ? LIMIT 1),
                ?, ?
            )
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        `;
        db.query(addToCartQuery, [user_id, variant_id, quantity], (err) => {
            if (err) {
                console.error("Error adding to cart:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json({ message: "Item added to cart" });
        });
    });
};

// PUT endpoint to update cart item quantity
exports.updateCartItemQuantity = (req, res) => {
    const { user_id, variant_id, quantity } = req.body;

    const stockQuery =
        "SELECT quantity FROM Product_Variant WHERE variant_id = ?";
    db.query(stockQuery, [variant_id], (err, results) => {
        if (err) {
            console.error("Error validating stock:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!results.length || results[0].quantity < quantity) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        const updateQuery = `
            UPDATE Cart_Items
            SET quantity = ?
            WHERE cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)
            AND variant_id = ?
        `;
        db.query(updateQuery, [quantity, user_id, variant_id], (err) => {
            if (err) {
                console.error("Error updating cart item:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            res.json({ message: "Cart item updated" });
        });
    });
};
