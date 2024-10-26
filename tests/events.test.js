const request = require('supertest');
const app = require('../app.js');
const Event = require('../models/Event');
const mongoose = require('mongoose');

describe('Event Routes', () => {
    describe('GET /api/events', () => {
        it('should return empty array when no events exist', async () => {
            const response = await request(app)
                .get('/api/events')
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it('should return all events', async () => {
            const testEvent = {
                title: 'Test Event',
                description: 'Test Description',
                date: '2024-12-25',
                time: '14:00',
                location: 'Test Location',
                category: 'Test Category',
                capacity: 100,
                price: 10.00,
                organizer: new mongoose.Types.ObjectId()
            };

            await Event.create(testEvent);

            const response = await request(app)
                .get('/api/events')
                .expect(200);

            expect(response.body.length).toBe(1);
            expect(response.body[0].title).toBe(testEvent.title);
        });
    });
});