// tests/tickets.test.js
const request = require('supertest');
const app = require('../app');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const mongoose = require('mongoose');

describe('Ticket Routes', () => {
    let testEvent;

    beforeAll(async () => {
        // Create a test event with organizer referencing the existing mock user
        testEvent = await Event.create({
            title: 'Test Event',
            description: 'Test Description',
            date: new Date('2024-12-25'), // Use Date object
            time: '14:00',
            location: 'Test Location',
            category: 'Test Category',
            capacity: 100,
            price: 10.00,
            organizer: mongoose.Types.ObjectId('507f1f77bcf86cd799439011') // Reference to the mock user
        });
    });

    beforeEach(async () => {
        // Clear all tickets before each test
        await Ticket.deleteMany({});
    });

    afterAll(async () => {
        // Clean up after tests
        await Ticket.deleteMany({});
        await Event.deleteMany({});
        await mongoose.connection.close(); // Ensure connection is closed after tests
    });

    describe('POST /api/tickets', () => {
        it('should create ticket when authenticated', async () => {
            const response = await request(app)
                .post('/api/tickets')
                // Remove manual Cookie setting; rely on mock session
                .send({
                    event: testEvent._id,
                    status: 'active'
                })
                .expect(201);

            expect(response.body.event).toBe(testEvent._id.toString());
            expect(response.body.user).toBe('507f1f77bcf86cd799439011'); // Mock user's ID
            expect(response.body.status).toBe('active');
        });
    });
});



