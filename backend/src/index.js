const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const cartRoutes = require('./routes/cartRoutes');
const searchRoutes = require('./routes/searchRoutes');
const productRoutes = require("./routes/productRoutes");
const authRoutes = require('./routes/authRoutes');

const port = process.env.PORT;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// integrate cart routes


// integrate search routes
app.use('/api/cart', cartRoutes);
app.use('/api/search', searchRoutes);
app.use('/assets', express.static('src/assets'));
app.use('/auth',authRoutes)

// integrate prodcuts routes
app.use("/api", productRoutes);

// Database connection
const db = require('./config/db');



app.get('/', (req, res) => {
    res.send('Backend is running');
});

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

module.exports = app; // Export the app for testing
