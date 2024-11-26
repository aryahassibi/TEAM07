const request = require('supertest');
const express = require('express');
const reviewRoutes = require('../routes/reviewRoutes');
const managerRoutes = require('../routes/managerRoutes');
const mysql = require('mysql2');

// Create a mock of the mysql database connection
jest.mock("mysql2");

const app = express();
app.use(express.json());
app.use('/reviews', reviewRoutes);
app.use('/managers', managerRoutes);

// Define mock database responses
const mockDb = mysql.createConnection();

// Mocking the database responses based on the test case
mockDb.execute.mockResolvedValue([{}]);  // Default mock response for success (e.g., successful insert)

// Test for submitting reviews
describe('POST /reviews/submit', () => {
  test('should successfully submit a review', async () => {
    const reviewData = {
      product_id: 1,
      user_id: 1,
      rating: 5,
      content: 'This is a great product!',
    };

    // Mock the database response for inserting a review
    mockDb.execute.mockResolvedValue([{}]); // Simulate a successful insert

    const response = await request(app)
      .post('/reviews/submit')
      .send(reviewData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Review submitted successfully. It is pending approval.');
  });

  test('should return an error if required fields are missing', async () => {
    const reviewData = {
      product_id: 1,
      user_id: 1,
      rating: 5,
      // Missing content
    };

    const response = await request(app)
      .post('/reviews/submit')
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required: product_id, user_id, rating, content.');
  });

  test('should return an error if rating is out of bounds', async () => {
    const reviewData = {
        product_id: 1,
        user_id: 1,
        rating: 6, // Invalid rating
        content: 'This product is awful!',
    };

    const response = await request(app)
        .post('/reviews/submit')
        .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Rating must be between 1 and 5.');
  });

  test('should return an error if product_id or user_id is missing', async () => {
    const reviewData = {
      // Missing product_id and user_id
      rating: 5,
      content: 'Great product!',
    };

    const response = await request(app)
      .post('/reviews/submit')
      .send(reviewData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('All fields are required: product_id, user_id, rating, content.');
  });
});

// Test for fetching approved reviews
describe('GET /reviews/:product_id/approved', () => {
  test('should fetch all approved reviews for a product', async () => {
    const product_id = 1; // Use a valid product ID from your database

    // Simulate database response with approved reviews
    const mockReviews = [
      {
        comment_id: 1,
        product_id: 1,
        user_id: 1,
        rating: 5,
        content: 'This is a great product!',
        created_at: '2024-11-01 12:00:00',
        username: 'testuser',
        email: 'testuser@example.com'
      }
    ];

    // Mock the database call to return mock reviews
    mockDb.execute.mockResolvedValue([mockReviews]);

    const response = await request(app)
      .get(`/reviews/${product_id}/approved`)
      .expect(200);

    expect(response.body.reviews).toBeInstanceOf(Array); // Ensure reviews is an array
    expect(response.body.reviews.length).toBeGreaterThan(0); // Ensure there are reviews returned
    expect(response.body.reviews[0]).toHaveProperty('comment_id');
    expect(response.body.reviews[0]).toHaveProperty('product_id');
    expect(response.body.reviews[0]).toHaveProperty('user_id');
    expect(response.body.reviews[0]).toHaveProperty('rating');
    expect(response.body.reviews[0]).toHaveProperty('content');
    expect(response.body.reviews[0]).toHaveProperty('created_at');
    expect(response.body.reviews[0]).toHaveProperty('username');
    expect(response.body.reviews[0]).toHaveProperty('email');
  });

  test('should return 404 if no approved reviews are found for the product', async () => {
    const product_id = 999; // Use a product ID that has no approved reviews

    // Simulate an empty response when no approved reviews are found
    mockDb.execute.mockResolvedValue([[]]); // No reviews

    const response = await request(app)
      .get(`/reviews/${product_id}/approved`)
      .expect(404);

    expect(response.body.message).toBe('No approved reviews found for this product.');
  });

  test('should return 400 if product_id is not provided', async () => {
    const response = await request(app)
      .get('/reviews/approved') // Invalid product ID
      .expect(400);

    expect(response.body.message).toBe('Product ID is required');
  });

  test('should return 400 for invalid product_id format', async () => {
    const response = await request(app)
      .get('/reviews/invalid_id/approved') // Invalid product_id
      .expect(400);
  
    expect(response.body.message).toBe('Invalid Product ID format');
  });  
});

// Test for managers to edit review status
// THIS ONE DOESN'T WORK. I DON'T GET WHY!!!
describe('PATCH /managers/reviews/:review_id', () => {
    let reviewId;

    beforeAll(async () => {
        // Mock the review creation to avoid triggering an actual INSERT query.
        mockDb.execute = jest.fn() // Ensure mockDb.execute is a Jest mock function

        // Mock the review creation (POST /reviews/submit)
        mockDb.execute.mockResolvedValueOnce([{ insertId: 1 }]); // Mocked insertId for review creation
    
        // Simulate a POST request to create a review (with mock data)
        const reviewData = {
            product_id: 1,
            user_id: 1,
            rating: 5,
            content: 'Great product!',
        };
    
        // Simulate the response from the review creation
        const response = await request(app)
            .post('/reviews/submit')
            .send(reviewData);
    
        // Set the reviewId directly from the mock (since mockDb.execute returned { insertId: 1 })
        reviewId = 1;
    
        // Ensure the reviewId is set correctly for later tests
        expect(reviewId).toBeDefined();
    });
  
    test('should approve a pending review', async () => {
        // Mock the database call for updating the review status to approved
        mockDb.execute.mockResolvedValue([{ affectedRows: 1 }]); // Simulate successful DB update
    
        const response = await request(app)
            .patch(`/managers/reviews/${reviewId}`) // This should match the test route
            .send({ action: 'approve' });
    
        // Check that the response is successful
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Review approved successfully.');
    
        // Verify that the database call was made with the correct parameters
        expect(mockDb.execute).toHaveBeenCalledWith(
            'UPDATE Comments SET approved = ? WHERE comment_id = ? AND approved = FALSE',
            [true, reviewId]
        );
    });
  
    test('should reject a pending review', async () => {
        // Mock successful database update for rejection
        mockDb.execute.mockResolvedValue([{ affectedRows: 1 }]); // Simulate successful DB update

        const response = await request(app)
            .patch(`/managers/reviews/${reviewId}`)
            .send({ action: 'reject' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Review rejected successfully.');

        // Verify DB call was made with correct parameters
        expect(mockDb.execute).toHaveBeenCalledWith(
            'UPDATE Comments SET approved = ? WHERE comment_id = ? AND approved = FALSE',
            [false, reviewId]
        );
    });

    test('should return 404 if review does not exist or is already approved/rejected', async () => {
        // Simulate no affected rows (review not found or already approved/rejected)
        mockDb.execute.mockResolvedValue([{ affectedRows: 0 }]);

        const response = await request(app)
            .patch('/managers/reviews/99999') // Non-existing review ID
            .send({ action: 'approve' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Review not found or already approved/rejected.');
    });

    test('should return 400 if action is invalid', async () => {
        const response = await request(app)
            .patch(`/managers/reviews/${reviewId}`)
            .send({ action: 'invalidAction' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Action must be 'approve' or 'reject'");
    });

    test('should return 403 if the user is not authorized', async () => {
        const response = await request(app)
            .patch(`/managers/reviews/${reviewId}`)
            .send({ action: 'approve' })
            .set('Authorization', 'Bearer invalid_token'); // Simulate an unauthorized user

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You must be a manager to perform this action.');
    });

    test('should return 400 if review ID is missing', async () => {
        const response = await request(app)
            .patch('/managers/reviews/') // Missing review ID in URL
            .send({ action: 'approve' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Review ID is required');
    });
});