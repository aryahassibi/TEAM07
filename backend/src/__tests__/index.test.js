const request = require('supertest');
const app = require('../index'); // Ensure this points to your main app file

describe('Product Endpoints', () => {
  it('GET /api/products should retrieve all products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('GET /api/products/:id should retrieve a product by ID', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('product_id');
  });

  it('POST /api/products should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Test Product',
        price: 10,
        category: 'Test Category'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('productId');
  });
});

describe('User Endpoints', () => {
  it('POST /api/users/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        phone_number: '1234567890',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('POST /api/users/login should login a user and return a token', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
