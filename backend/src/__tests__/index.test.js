const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock data for products and users
const mockProducts = [
  { product_id: 1, name: 'Product 1', price: 10 },
  { product_id: 2, name: 'Product 2', price: 20 },
];

const mockUsers = [
  { user_id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
];

// Mocking functions
jest.mock('mysql2');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Product API Endpoints', () => {
  beforeEach(() => {
    mysql.createConnection().query.mockReset();
  });

  test('GET /api/products should return all products', async () => {
    mysql.createConnection().query.mockImplementation((sql, callback) => callback(null, mockProducts));

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProducts);
    expect(mysql.createConnection().query).toHaveBeenCalledWith('SELECT * FROM Products', expect.any(Function));
  });

  test('GET /api/products/:id should return a single product', async () => {
    mysql.createConnection().query.mockImplementation((sql, params, callback) => callback(null, [mockProducts[0]]));

    const res = await request(app).get('/api/products/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockProducts[0]);
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      'SELECT * FROM Products WHERE product_id = ?',
      ['1'],
      expect.any(Function)
    );
  });

  test('POST /api/products should create a new product', async () => {
    const newProduct = { name: 'New Product', price: 30 };
    mysql.createConnection().query.mockImplementation((sql, data, callback) => callback(null, { insertId: 3 }));

    const res = await request(app).post('/api/products').send(newProduct);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: 'Product created', productId: 3 });
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      'INSERT INTO Products SET ?',
      newProduct,
      expect.any(Function)
    );
  });

});

describe('User API Endpoints', () => {
  beforeEach(() => {
    mysql.createConnection().query.mockReset();
  });

  test('POST /api/users/register should register a new user', async () => {
    const newUser = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', password: 'password123' };
    mysql.createConnection().query
      .mockImplementationOnce((sql, params, callback) => callback(null, [])) // Check if user exists
      .mockImplementationOnce((sql, data, callback) => callback(null, { insertId: 1 })); // Insert new user

    const res = await request(app).post('/api/users/register').send(newUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: 'User registered', userId: 1 });
    expect(bcrypt.hash).toHaveBeenCalledWith(newUser.password, 10, expect.any(Function));
  });

  test('POST /api/users/login should log in a user', async () => {
    const loginData = { email: 'john@example.com', password: 'password123' };
    mysql.createConnection().query.mockImplementationOnce((sql, params, callback) =>
      callback(null, [{ user_id: 1, password_hash: 'hashedPassword' }])
    );

    const res = await request(app).post('/api/users/login').send(loginData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Login successful', token: 'mock-jwt-token' });
    expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, 'hashedPassword', expect.any(Function));
  });
});


describe('Cart API Endpoints', () => {
  beforeEach(() => {
    mysql.createConnection().query.mockReset();
  });
  
  test('GET /api/cart/:user_id should fetch cart items', async () => {
    const mockUserId = 1;
    const mockCartItems = [
      {
        product_id: 2,
        name: 'Product Name',
        price: 100,
        quantity: 2,
        subtotal: 200,
      },
    ];
  
    mysql.createConnection().query.mockImplementation((sql, params, callback) => callback(null, mockCartItems));
  
    const res = await request(app).get(`/api/cart/${mockUserId}`);
  
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ items: mockCartItems, total: 200 });
  
    // Normalize query string
    const expectedQuery = `
      SELECT ci.product_id, p.name, p.price, ci.quantity, (p.price * ci.quantity) AS subtotal
      FROM ShoppingCartItems ci
      JOIN Products p ON ci.product_id = p.product_id
      WHERE ci.cart_id = (SELECT cart_id FROM ShoppingCart WHERE user_id = ? LIMIT 1)
    `.replace(/\s+/g, ' ').trim(); // Remove extra spaces
  
    const receivedQuery = mysql.createConnection().query.mock.calls[0][0].replace(/\s+/g, ' ').trim(); // Normalize actual query
  
    expect(receivedQuery).toBe(expectedQuery); // Compare normalized queries
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      expect.any(String),
      [String(mockUserId)], // Ensure user_id is passed as a string
      expect.any(Function)
    );
  });

  test('POST /api/cart/add should add an item to the cart', async () => {
    const mockCartId = 1;
    const mockVariantId = 2;
    const mockUserId = 1;
    const mockQuantity = 3;

    mysql.createConnection().query
      .mockImplementationOnce((sql, params, callback) => callback(null, [{ quantity: 10 }])) // Check stock
      .mockImplementationOnce((sql, params, callback) => callback(null)); // Add to cart

    const res = await request(app).post('/api/cart/add').send({
      user_id: mockUserId,
      variant_id: mockVariantId,
      quantity: mockQuantity,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Item added to cart' });
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      'SELECT quantity FROM Product_Variant WHERE variant_id = ?',
      [mockVariantId],
      expect.any(Function)
    );
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO Cart_Items'),
      expect.arrayContaining([mockUserId, mockVariantId, mockQuantity]),
      expect.any(Function)
    );
  });

  test('PUT /api/cart/update should update cart item quantity', async () => {
    const mockUserId = 1;
    const mockVariantId = 2;
    const mockQuantity = 5;

    mysql.createConnection().query
      .mockImplementationOnce((sql, params, callback) => callback(null, [{ quantity: 10 }])) // Check stock
      .mockImplementationOnce((sql, params, callback) => callback(null)); // Update quantity

    const res = await request(app).put('/api/cart/update').send({
      user_id: mockUserId,
      variant_id: mockVariantId,
      quantity: mockQuantity,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: 'Cart item updated' });
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      'SELECT quantity FROM Product_Variant WHERE variant_id = ?',
      [mockVariantId],
      expect.any(Function)
    );
    expect(mysql.createConnection().query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE Cart_Items'),
      expect.arrayContaining([mockQuantity, mockUserId, mockVariantId]),
      expect.any(Function)
    );
  });
});