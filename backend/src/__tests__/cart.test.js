const request = require('supertest');
const app = require('../index');
const mysql = require('mysql2');

// Mocking functions
jest.mock('mysql2');

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
});