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
        // Create a test user first
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        });

        // Create a test event with the created user as organizer
        testEvent = await Event.create({
            title: 'Review Test Event',
            description: 'Test Description for Review',
            date: new Date('2024-12-25'),
            time: '14:00',
            location: 'Test Location',
            category: 'Test Category',
            capacity: 100,
            price: 10.00,
            organizer: testUser._id // Use the actual user's ID
        });
    });

    beforeEach(async () => {
        await Review.deleteMany({});
    });

    afterAll(async () => {
        await Review.deleteMany({});
        await Event.deleteMany({});
        await User.deleteMany({});
    });

    describe('POST /api/reviews', () => {
        it('should return 404 for non-existent event', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post(`/api/reviews/${nonExistentId}`)
                .expect(404);
        });
    });

    describe('GET /api/reviews', () => {
        it('should retrieve all reviews', async () => {
            await Review.create([
                {
                    event: testEvent._id,
                    user: testUser._id,
                    rating: 5,
                    comment: 'Amazing event!'
                },
                {
                    event: testEvent._id,
                    user: testUser._id,
                    rating: 4,
                    comment: 'Great event!'
                }
            ]);

            const response = await request(app)
                .get('/api/reviews')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('PUT /api/reviews/:id', () => {
        it('should update a review', async () => {
            const review = await Review.create({
                event: testEvent._id,
                user: testUser._id,
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
            const response = await request(app)
                .put(`/api/reviews/${nonExistentId}`)
                .send({ rating: 3 })
                .expect(404);

            expect(response.body).toHaveProperty('message', 'Review not found');
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it('should NOT delete a review when not authorized', async () => {
            const review = await Review.create({
                event: testEvent._id,
                user: testUser._id,
                rating: 5,
                comment: 'Outstanding!'
            });

            const response = await request(app)
                .delete(`/api/reviews/${review._id}`)
                .expect(403);
        });
    });
});
