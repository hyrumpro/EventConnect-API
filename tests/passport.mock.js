// tests/passport.mock.js
const passport = require('passport');
const MockStrategy = require('passport-mock-strategy');

// Create a mock user for testing
const mockUser = {
    id: '123',
    googleId: 'mock_google_id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'organizer'
};

// Configure mock strategy
passport.use(new MockStrategy({
    name: 'google',
    user: mockUser
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    done(null, mockUser);
});

module.exports = passport;
