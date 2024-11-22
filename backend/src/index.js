const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

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

// GET endpoint to list all products and their variants
app.get('/api/products', (req, res) => {
    const query = `
        SELECT 
            p.product_id, p.name, pv.variant_id, pv.weight_grams, pv.price, pv.stock, pv.sku
        FROM 
            Products p
        JOIN 
            Product_Variant pv ON p.product_id = pv.product_id;
    `;
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error retrieving products:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// POST endpoint to add items to the cart
app.post('/api/cart', (req, res) => {
    const { userId, variantId, quantity } = req.body;

    if (!variantId || !quantity) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO ShoppingCartItems (cart_id, variant_id, quantity)
        VALUES (
            (SELECT cart_id FROM ShoppingCart WHERE user_id = ?),
            ?, ?
        )
        ON DUPLICATE KEY UPDATE
            quantity = quantity + VALUES(quantity);
    `;

    db.query(query, [userId || null, variantId, quantity], (error, results) => {
        if (error) {
            console.error('Error adding item to cart:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Item added to cart' });
    });
});

// GET endpoint to retrieve cart items for a user
app.get('/api/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
        SELECT 
            sci.quantity, pv.weight_grams, pv.price, pv.stock, p.name, pv.variant_id
        FROM 
            ShoppingCartItems sci
        JOIN 
            Product_Variant pv ON sci.variant_id = pv.variant_id
        JOIN 
            Products p ON pv.product_id = p.product_id
        WHERE 
            sci.cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?);
    `;

    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Error retrieving cart items:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

// PUT endpoint to update cart item quantity
app.put('/api/cart', (req, res) => {
    const { userId, variantId, quantity } = req.body;

    const query = `
        UPDATE ShoppingCartItems
        SET quantity = quantity + ?
        WHERE cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)
          AND variant_id = ?;
    `;

    db.query(query, [quantity, userId, variantId], (error, results) => {
        if (error) {
            console.error('Error updating cart item:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Cart item updated' });
    });
});

// DELETE endpoint to remove an item from the cart
app.delete('/api/cart', (req, res) => {
    const { userId, variantId } = req.body;

    const query = `
        DELETE FROM ShoppingCartItems
        WHERE cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)
          AND variant_id = ?;
    `;

    db.query(query, [userId, variantId], (error, results) => {
        if (error) {
            console.error('Error removing cart item:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Cart item removed' });
    });
});

// POST endpoint for user registration
app.post('/api/users/register', async (req, res) => {
    const { first_name, last_name, email, phone_number, password } = req.body;

    const checkUserQuery = 'SELECT * FROM Users WHERE email = ?';
    db.query(checkUserQuery, [email], async (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            const insertUserQuery = 'INSERT INTO Users SET ?';
            const newUser = {
                first_name,
                last_name,
                email,
                phone_number,
                password_hash: hash
            };
            db.query(insertUserQuery, newUser, (error, result) => {
                if (error) {
                    console.error('Error creating user:', error);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                res.status(201).json({ message: 'User registered', userId: result.insertId });
            });
        });
    });
});

// POST endpoint for user login
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM Users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = results[0];
        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: 'Login successful', token });
        });
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend is running');
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app; // Export the app for testing
