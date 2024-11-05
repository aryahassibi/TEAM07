const mysql = jest.genMockFromModule('mysql2');

mysql.createConnection = jest.fn(() => ({
  connect: jest.fn((callback) => callback(null)),
  query: jest.fn((query, values, callback) => {
    if (query.includes('SELECT * FROM Products')) {
      callback(null, [{ product_id: 1, name: 'Sample Product' }]);
    } else if (query.includes('SELECT * FROM Products WHERE product_id = ?')) {
      callback(null, [{ product_id: 1, name: 'Sample Product' }]);
    } else if (query.includes('INSERT INTO Products')) {
      callback(null, { insertId: 1 });
    } else if (query.includes('SELECT * FROM Users WHERE email = ?')) {
      // Return empty array to simulate no existing user for registration
      callback(null, []);
    } else if (query.includes('INSERT INTO Users')) {
      // Simulate successful user insertion with insertId
      callback(null, { insertId: 1 });
    } else {
      callback(null, []);
    }
  }),
  end: jest.fn(),
}));

module.exports = mysql;
