const mysql = jest.genMockFromModule('mysql2');

mysql.createConnection = jest.fn(() => ({
  connect: jest.fn((callback) => callback(null)), // Mock successful connection
  query: jest.fn((query, values, callback) => {
    if (query.includes('SELECT * FROM Products')) {
      callback(null, [{ product_id: 1, name: 'Sample Product' }]); // Mock product data
    } else if (query.includes('SELECT * FROM Users WHERE email = ?')) {
      callback(null, [{ user_id: 1, email: 'johndoe@example.com', password_hash: '$2b$10$hashedPassword' }]); // Mock user data
    } else if (query.includes('INSERT INTO Users')) {
      callback(null, { insertId: 1 }); // Mock user insertion
    } else {
      callback(null, []); // Default empty result
    }
  }),
  end: jest.fn(),
}));

module.exports = mysql;
