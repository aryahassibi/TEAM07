const express = require('express');
const UsersController = require('../controllers/userController');

const router = express.Router();
const usersController = new UsersController(); // Instantiate UsersController

// Registration Endpoint
router.post('/register', async (req, res) => {
    try {
        const user = req.body; // Get user details from the request body
        const result = await usersController.register(user); // Call register method
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Get email and password from the request body
        const userDetails = await usersController.login(email, password); // Call login method
        res.status(200).json(userDetails);
    } catch (err) {
        res.status(401).json({ error: err.message }); // Unauthorized
    }
});

module.exports = router;
