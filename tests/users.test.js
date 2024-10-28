const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const mongoose = require('mongoose');

describe('User Routes', () => {

    afterAll(async () => {
        // Clean up after tests
        await User.deleteMany({});
        await mongoose.connection.close(); // Ensure connection is closed after tests
    });

    describe('POST /api/users', () => {
        it('should return 400 for missing required fields', async () => {
            const incompleteUser = {
                email: 'incomplete@example.com'
            };

            const response = await request(app)
                .post('/api/users')
                .send(incompleteUser)
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/users/:id', () => {
        it('should retrieve a user by ID', async () => {
            const user = await User.create({
                name: 'Retrieve User',
                email: 'retrieve@example.com',
                role: 'user'
            });

            const response = await request(app)
                .get(`/api/users/${user._id}`)
                .expect(200);

            expect(response.body._id).toBe(user._id.toString());
            expect(response.body.name).toBe(user.name);
            expect(response.body.email).toBe(user.email.toLowerCase());
            expect(response.body.role).toBe(user.role);
        });

        it('should return 404 for non-existent user', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .get(`/api/users/${nonExistentId}`)
                .expect(404);
        });

        it('should return 400 for invalid user ID', async () => {
            const response = await request(app)
                .get('/api/users/invalid-id')
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update a user', async () => {
            const user = await User.create({
                name: 'Update User',
                email: 'update@example.com',
                role: 'user'
            });

            const updatedData = {
                name: 'Updated User',
                role: 'organizer'
            };

            const response = await request(app)
                .put(`/api/users/${user._id}`)
                .send(updatedData)
                .expect(200);

            expect(response.body.name).toBe(updatedData.name);
            expect(response.body.role).toBe(updatedData.role);
        });

        it('should return 404 for non-existent user', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const updatedData = {
                name: 'Non-existent User'
            };

            const response = await request(app)
                .put(`/api/users/${nonExistentId}`)
                .send(updatedData)
                .expect(404);

        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user', async () => {
            const user = await User.create({
                name: 'Delete User',
                email: 'delete@example.com',
                role: 'user'
            });

            const response = await request(app)
                .delete(`/api/users/${user._id}`)
                .expect(200);

            expect(response.body).toHaveProperty('message', 'User deleted successfully');


            const deletedUser = await User.findById(user._id);
            expect(deletedUser).toBeNull();
        });


        it('should return 400 for invalid user ID', async () => {
            const response = await request(app)
                .delete('/api/users/invalid-id')
                .expect(400);

            expect(response.body).toHaveProperty('errors');
        });
    });
});
