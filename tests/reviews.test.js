// tests/review.test.js
const request = require('supertest');
const app = require('../app');
const Review = require('../models/Review');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Review Routes', () => {
    let testEvent;
    let testUser;

    beforeAll(async () => {
        // Create a test event with organizer referencing the existing mock user
        testEvent = await Event.create({
            title: 'Review Test Event',
            description: 'Test Description for Review',
            date: new Date('2024-12-25'),
            time: '14:00',
            location: 'Test Location',
            category: 'Test Category',
            capacity: 100,
            price: 10.00,
            organizer: mongoose.Types.ObjectId('507f1f77bcf86cd799439011') // Reference to the mock user
        });

        // Optionally, create another user for review ownership
        testUser = await User.create({
            name: 'Review User',
            email: 'reviewuser@example.com',
            role: 'user'
        });
    });

    beforeEach(async () => {
        // Clear all reviews before each test
        await Review.deleteMany({});
    });

    afterAll(async () => {
        // Clean up after tests
        await Review.deleteMany({});
        await Event.deleteMany({});
        await User.deleteMany({});
        await mongoose.connection.close(); // Ensure connection is closed after tests
    });

    describe('POST /api/reviews', () => {
        it('should create a new review when authenticated', async () => {
            const newReview = {
                event: testEvent._id,
                rating: 5,
                comment: 'Excellent event!'
            };

            const response = await request(app)
                .post('/api/reviews')
                .send(newReview)
                .expect(201);

            expect(response.body).toHaveProperty('_id');
            expect(response.body.event).toBe(testEvent._id.toString());
            expect(response.body.user).toBe('507f1f77bcf86cd799439011'); // Mock user's ID
            expect(response.body.rating).toBe(newReview.rating);
            expect(response.body.comment).toBe(newReview.comment);
        });

        it('should return 400 for missing required fields', async () => {
            const incompleteReview = {
                event: testEvent._id,
                rating: 4
                // Missing 'comment'
            };

            const response = await request(app)
                .post('/api/reviews')
                .send(incompleteReview)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.comment).toBe('Comment is required');
        });

        it('should return 400 for invalid rating', async () => {
            const invalidReview = {
                event: testEvent._id,
                rating: 6, // Invalid rating
                comment: 'Too good to be true!'
            };

            const response = await request(app)
                .post('/api/reviews')
                .send(invalidReview)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.rating).toBe('Rating must be between 1 and 5');
        });

        it('should return 404 for non-existent event', async () => {
            const nonExistentEventId = new mongoose.Types.ObjectId();
            const review = {
                event: nonExistentEventId,
                rating: 4,
                comment: 'Good event!'
            };

            const response = await request(app)
                .post('/api/reviews')
                .send(review)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Event not found');
        });
    });

    describe('GET /api/reviews', () => {
        it('should retrieve all reviews', async () => {
            // Create multiple reviews
            await Review.create([
                {
                    event: testEvent._id,
                    user: '507f1f77bcf86cd799439011',
                    rating: 5,
                    comment: 'Amazing event!'
                },
                {
                    event: testEvent._id,
                    user: '507f1f77bcf86cd799439011',
                    rating: 4,
                    comment: 'Great event!'
                }
            ]);

            const response = await request(app)
                .get('/api/reviews')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should return an empty array when no reviews exist', async () => {
            const response = await request(app)
                .get('/api/reviews')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });
    });

    describe('GET /api/reviews/:id', () => {
        it('should retrieve a review by ID', async () => {
            const review = await Review.create({
                event: testEvent._id,
                user: '507f1f77bcf86cd799439011',
                rating: 5,
                comment: 'Outstanding!'
            });

            const response = await request(app)
                .get(`/api/reviews/${review._id}`)
                .expect(200);

            expect(response.body._id).toBe(review._id.toString());
            expect(response.body.event).toBe(testEvent._id.toString());
            expect(response.body.user).toBe('507f1f77bcf86cd799439011');
            expect(response.body.rating).toBe(review.rating);
            expect(response.body.comment).toBe(review.comment);
        });

        it('should return 404 for non-existent review', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/reviews/${nonExistentId}`)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Review not found');
        });

        it('should return 400 for invalid review ID', async () => {
            const response = await request(app)
                .get('/api/reviews/invalid-id')
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.id).toBe('Invalid review ID');
        });
    });

    describe('PUT /api/reviews/:id', () => {
        it('should update a review', async () => {
            const review = await Review.create({
                event: testEvent._id,
                user: '507f1f77bcf86cd799439011',
                rating: 4,
                comment: 'Good event'
            });

            const updatedData = {
                rating: 5,
                comment: 'Excellent event!'
            };

            const response = await request(app)
                .put(`/api/reviews/${review._id}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.rating).toBe(updatedData.rating);
            expect(response.body.comment).toBe(updatedData.comment);
        });

        it('should return 404 for non-existent review', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const updatedData = {
                rating: 3,
                comment: 'Average event'
            };

            const response = await request(app)
                .put(`/api/reviews/${nonExistentId}`)
                .send(updatedData)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Review not found');
        });

        it('should return 400 for invalid review ID', async () => {
            const response = await request(app)
                .put('/api/reviews/invalid-id')
                .send({ rating: 2 })
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.id).toBe('Invalid review ID');
        });

        it('should return 400 for invalid rating', async () => {
            const review = await Review.create({
                event: testEvent._id,
                user: '507f1f77bcf86cd799439011',
                rating: 3,
                comment: 'Average event'
            });

            const updatedData = {
                rating: 6, // Invalid rating
                comment: 'Too good!'
            };

            const response = await request(app)
                .put(`/api/reviews/${review._id}`)
                .send(updatedData)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.rating).toBe('Rating must be between 1 and 5');
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it('should delete a review', async () => {
            const review = await Review.create({
                event: testEvent._id,
                user: '507f1f77bcf86cd799439011',
                rating: 5,
                comment: 'Outstanding!'
            });

            const response = await request(app)
                .delete(`/api/reviews/${review._id}`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'Review deleted successfully');

            // Verify deletion
            const deletedReview = await Review.findById(review._id);
            expect(deletedReview).toBeNull();
        });

        it('should return 404 for non-existent review', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .delete(`/api/reviews/${nonExistentId}`)
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Review not found');
        });

        it('should return 400 for invalid review ID', async () => {
            const response = await request(app)
                .delete('/api/reviews/invalid-id')
                .expect(400);

            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors.id).toBe('Invalid review ID');
        });
    });
});
