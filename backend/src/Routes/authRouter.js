const express = require('express');
const { register, login } = require('../Services/authService');

const router = express.Router();

// Registration Endpoint
router.post('/register', async (req, res) => {
    try {
        const user = req.body; // Get user details from the request body
        const result = await register(user);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login Endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Get email and password from the request body
        const userDetails = await login(email, password);
        res.status(200).json(userDetails);
    } catch (err) {
        res.status(401).json({ error: err.message }); // Unauthorized
    }
});

module.exports = router;
