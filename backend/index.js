const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = process.env.PORT || 5000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password', // Replace with your actual MySQL password
  database: 'online_store'    // Make sure the database name is correct
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL connected');
});

// API route to get products
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});