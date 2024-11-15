const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT;


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Middleware to parse JSON bodies
app.use(express.json());

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

// GET endpoint to list all products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM Products', (error, results) => {
    if (error) {
      console.error('Error retrieving products:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// GET endpoint to retrieve a single product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  db.query(
    'SELECT * FROM Products WHERE product_id = ?',
    [productId],
    (error, results) => {
      if (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(results[0]);
    }
  );
});

// POST endpoint to create a new product
app.post('/api/products', (req, res) => {
  const productData = req.body;
  const query = 'INSERT INTO Products SET ?';
  db.query(query, productData, (error, results) => {
    if (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res
      .status(201)
      .json({ message: 'Product created', productId: results.insertId });
  });
});

// PUT endpoint to update a product
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;
  const query = 'UPDATE Products SET ? WHERE product_id = ?';
  db.query(query, [updateData, productId], (error, results) => {
    if (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated' });
  });
});

// DELETE endpoint to delete a product
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM Products WHERE product_id = ?';
  db.query(query, [productId], (error, results) => {
    if (error) {
      console.error('Error deleting product:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  });
});


// POST endpoint for user registration
app.post('/api/users/register', async (req, res) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM Users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }


    //Hash the password before storing
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Insert the new user with the hashed password
      const insertUserQuery = 'INSERT INTO Users SET ?';
      const newUser = {
        first_name,
        last_name,
        email,
        phone_number,
        password_hash: hash, // **Store the hashed password**
      };
      db.query(insertUserQuery, newUser, (error, result) => {
        if (error) {
          console.error('Error creating user:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res
          .status(201)
          .json({ message: 'User registered', userId: result.insertId });
      });
    });
  });
});

// **Added POST endpoint for user login with authentication**
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  // Fetch the user by email
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

    // Compare the provided password with the stored password hash
    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user.user_id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ message: 'Login successful', token });
    });
  });
});

// DELETE endpoint to delete a user
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM Users WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// PUT endpoint to update a user's details
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { first_name, last_name, email, phone_number, password } = req.body;

  // Hash the password if provided
  const updateUser = { first_name, last_name, email, phone_number };
  if (password) {
    const saltRounds = 10;
    updateUser.password_hash = await bcrypt.hash(password, saltRounds);
  }

  const query = 'UPDATE Users SET ? WHERE user_id = ?';
  db.query(query, [updateUser, userId], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
});

// GET endpoint to retrieve a user's details by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT user_id, first_name, last_name, email, phone_number FROM Users WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]);
  });
});

// GET endpoint to list all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT user_id, first_name, last_name, email, phone_number FROM Users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});


// GET endpoint to fetch cart items
// go to localhost:5001/api/cart/1
app.get('/api/cart/:user_id', (req, res) => {
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
});

// POST endpoint to add item to cart
app.post('/api/cart/add', (req, res) => {
  const { user_id, variant_id, quantity } = req.body;

  // Check stock in Product_Variant
  const checkStockQuery = 'SELECT quantity FROM Product_Variant WHERE variant_id = ?';
  db.query(checkStockQuery, [variant_id], (err, results) => {
    if (err) {
      console.error('Error checking stock:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!results.length || results[0].quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Add item to cart
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
        console.error('Error adding to cart:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Item added to cart' });
    });
  });
});


// PUT endpoint to update cart item quantity
app.put('/api/cart/update', (req, res) => {
  const { user_id, variant_id, quantity } = req.body;

  // Validate stock in Product_Variant
  const stockQuery = 'SELECT quantity FROM Product_Variant WHERE variant_id = ?';
  db.query(stockQuery, [variant_id], (err, results) => {
    if (err) {
      console.error('Error validating stock:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!results.length || results[0].quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update cart item quantity
    const updateQuery = `
      UPDATE Cart_Items
      SET quantity = ?
      WHERE cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)
      AND variant_id = ?
    `;
    db.query(updateQuery, [quantity, user_id, variant_id], (err) => {
      if (err) {
        console.error('Error updating cart item:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Cart item updated' });
    });
  });
});

// DELETE endpoint to remove item from cart
app.delete('/api/cart/remove', (req, res) => {
  const { user_id, variant_id } = req.body;

  const removeQuery = `
    DELETE FROM Cart_Items
    WHERE cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ?)
    AND variant_id = ?
  `;
  db.query(removeQuery, [user_id, variant_id], (err) => {
    if (err) {
      console.error('Error removing item from cart:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Item removed from cart' });
  });
});



app.get('/', (req, res) => {
  res.send('Backend is running');
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app; // Export the app for testing