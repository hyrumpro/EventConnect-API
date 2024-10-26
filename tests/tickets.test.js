// tests/tickets.test.js
const request = require('supertest');
const app = require('../app');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('Ticket Routes', () => {
    let testEvent;
    let testUser;

    beforeAll(async () => {
        // Create a test user first
        testUser = await User.create({
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
        });

        // Create a test event
        testEvent = await Event.create({
            title: 'Test Event',
            description: 'Test Description',
            date: new Date('2024-12-25'),
            time: '14:00',
            location: 'Test Location',
            category: 'Test Category',
            capacity: 100,
            price: 10.00,
            organizer: testUser._id
        });

        global.mockSession = (req, res, next) => {
            req.user = testUser;
            req.isAuthenticated = () => true;
            next();
        };
    });

    beforeEach(async () => {
        await Ticket.deleteMany({});
    });

    afterAll(async () => {
        await Ticket.deleteMany({});
        await Event.deleteMany({});
        await User.deleteMany({});
    });

    describe('POST /api/tickets', () => {
        it('should create ticket when authenticated', async () => {
            // Mock authenticated session
            const agent = request.agent(app);

            // Simulate authenticated user
            const response = await agent
                .post('/api/tickets')
                .send({
                    event: testEvent._id,
                    status: 'active'
                })
                .expect(201);

            expect(response.body.event).toBe(testEvent._id.toString());
            expect(response.body.user).toBe(testUser._id.toString());
            expect(response.body.status).toBe('active');
        });

        it('should return 400 for invalid event ID', async () => {
            const response = await request(app)
                .post('/api/tickets')
                .send({
                    event: 'invalid-id',
                    status: 'active'
                })
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/tickets', () => {
        it('should return all tickets for admin', async () => {
            // Create an admin user
            const adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin'
            });

            await Ticket.create([
                {
                    event: testEvent._id,
                    user: testUser._id,
                    status: 'active'
                },
                {
                    event: testEvent._id,
                    user: testUser._id,
                    status: 'used'
                }
            ]);

            const response = await request(app)
                .get('/api/tickets')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2);
        });

        it('should return 201 for everyone', async () => {
            await request(app)
                .get('/api/tickets')
                .expect(201);
        });
    });

    describe('GET /api/tickets/:id', () => {
        it('should return ticket by ID for authorized user', async () => {
            // Create a test ticket
            const ticket = await Ticket.create({
                event: testEvent._id,
                user: testUser._id,
                status: 'active'
            });

            const response = await request(app)
                .get(`/api/tickets/${ticket._id}`)
                .expect(200);

            expect(response.body._id).toBe(ticket._id.toString());
            expect(response.body.event).toBe(testEvent._id.toString());
            expect(response.body.user).toBe(testUser._id.toString());
        });

        it('should return 404 for non-existent ticket', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            await request(app)
                .get(`/api/tickets/${nonExistentId}`)
                .set('Cookie', [`connect.sid=s%3Aj%3A${JSON.stringify({ user: testUser })}`])
                .expect(404);
        });
    });
});



