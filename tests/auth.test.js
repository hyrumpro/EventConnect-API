const request = require('supertest');
const app = require('../app.js');

describe('Auth Routes', () => {
    it('GET /auth/google should initiate Google OAuth and redirect', async () => {
        const response = await request(app)
            .get('/auth/google/callback')
            .expect(302);
    });
});

