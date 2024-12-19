const express = require('express');
const UsersController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const mysql = require("mysql2");
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection
const db = require('../config/db');

const router = express.Router();
const usersController = new UsersController(); 

// Middleware for validating user input


// Registration Endpoint
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, phone_number } = req.body;
  
  
    try {
    
      db.query(
        'SELECT * FROM Users WHERE email = ? OR phone_number = ?',
        [email, phone_number],
        async (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
  
          if (results.length > 0) {
            return res.status(400).json({ error: 'Email or Phone number already exists' });
          }
  
          const passwordString = String(password);
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(passwordString, salt);
  
          
          db.query(
            'INSERT INTO Users (first_name, last_name, email, phone_number, password_hash) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, hashedPassword],
            (insertErr, result) => {
              if (insertErr) {
                console.error('Insert error:', insertErr);
                return res.status(500).json({ error: 'Failed to register user' });
              }
  
              
              res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
            }
          );
        }
      );
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });


// Login Endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.error(req.body);


    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }


    // Check for a match in Managers table
    const managerQuery = "SELECT manager_id, first_name, last_name, password_hash, role FROM Managers WHERE email = ?";
    //const managerQuery = "SELECT manager_id, first_name, last_name, email, password_hash, role FROM Managers";

    //console.error(managerQuery);

    db.query(managerQuery, [email], async (err, results) => {

        console.error("this is the result: ",results);

        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        
        if (results.length > 0) {
            const manager = results[0];
            console.error("now we are inside: ",manager);



            // Hash the provided password using SHA256 to match the database hash
            const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
            console.error(hashedPassword);

            if (hashedPassword !== manager.password_hash) {
                // Password does not match
                console.error("Password mismatch for manager:", email);
                return res.status(401).json({ error: "Invalid email or password" });
            }

            // Generate JWT token
            const token = jwt.sign(
                { manager_id: manager.manager_id, role: manager.role },
                JWT_SECRET,
                { expiresIn: "12h" }
            );

            console.log("Manager login successful:", email);
            return res.json({ token, role: manager.role }); // Include role in response
        }


        // If no match in Managers, check Users table
        const userQuery = "SELECT user_id, password_hash FROM Users WHERE email = ?";
        db.query(userQuery, [email], async (userErr, userResults) => {
            if (userErr) {
                console.error(userErr);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (userResults.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const user = userResults[0];
            const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

            if (!isPasswordMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const token = jwt.sign(
                { user_id: user.user_id },
                JWT_SECRET,
                { expiresIn: "12h" }
            );

            res.json({ token, role: "user" }); // Non-admin users
        });
    });
});


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await usersController.getUsers(); // Call getUsers method
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await usersController.getUserById(id); // Call getUserById method
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
});

// Update user details
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userDetails = req.body; // Get updated user details from the request body
        const result = await usersController.updateUserDetails(userDetails, id); // Call updateUserDetails method
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await usersController.deleteUser(id); // Call deleteUser method
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
});

// Update user password
router.put('/:id/password', async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body; // Get new password from the request body

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const result = await usersController.updatePassword(hashedPassword, id); // Call updatePassword method
        res.status(200).json({ message: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Check if user is an admin
router.get('/:id/is-admin', async (req, res) => {
    const { id } = req.params;

    try {
        const isAdminResult = await usersController.isAdmin(id);

        if (isAdminResult.isAdmin) {
            res.json({ isAdmin: true, role: isAdminResult.role });
        } else {
            res.json({ isAdmin: false });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

  

module.exports = router;
