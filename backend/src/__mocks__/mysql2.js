/*const mysql = jest.genMockFromModule('mysql2');

mysql.createConnection = jest.fn(() => ({
  connect: jest.fn((callback) => callback(null)),
  query: jest.fn((query, values, callback) => {
    if (query.includes('SELECT * FROM Products')) {
      callback(null, [{ product_id: 2, name: 'Sample Product' }]);
    } else if (query.includes('SELECT * FROM Products WHERE product_id = ?')) {
      callback(null, [{ product_id: 2, name: 'Sample Product' }]);
    } else if (query.includes('INSERT INTO Products')) {
      callback(null, { insertId: 2 });
    } else if (query.includes('SELECT * FROM Users WHERE email = ?')) {
      // Return empty array to simulate no existing user for registration
      callback(null, []);
    } else if (query.includes('INSERT INTO Users')) {
      // Simulate successful user insertion with insertId
      callback(null, { insertId: 2 });
    } else {
      callback(null, []);
    }
  }),
  end: jest.fn(),
}));

module.exports = mysql;
*/

const mysql = jest.genMockFromModule('mysql2');

function queryMock(query, values, callback) {
    if (query.includes('SELECT * FROM Products')) {
        // Returns a list of products successfully
        callback(null, [{
            product_id: 1,
            name: 'Sample Product',
            price: 10.99,
            category: 'Test Category'
        }]);
    } else if (query.includes('SELECT * FROM Products WHERE product_id = ?')) {
        // Returns a single product or none based on the ID provided
        const product = values[0] === 1 ? [{ product_id: 1, name: 'Sample Product' }] : [];
        callback(null, product);
    } else if (query.includes('INSERT INTO Products')) {
        // Simulates successful product insertion
        callback(null, { insertId: 1 });
    } else if (query.includes('SELECT * FROM Users WHERE email = ?')) {
        // Simulates a user check, returns empty for non-existing user
        const userExists = values.includes('johndoe@example.com');
        callback(null, userExists ? [{
            user_id: 1,
            email: 'johndoe@example.com',
            password_hash: 'mock-hash'
        }] : []);
    } else if (query.includes('INSERT INTO Users')) {
        // Simulates successful user registration
        callback(null, { insertId: 1 });
    } else {
        // Default case to catch unhandled queries
        callback(new Error("Unhandled SQL Query"), null);
    }
}

mysql.createConnection = jest.fn(() => ({
    connect: jest.fn((callback) => callback(null)),
    query: queryMock,
    end: jest.fn(),
}));

module.exports = mysql;
