const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
require('dotenv').config({ path: '.env.test' });

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'test-secret',
    resave: false,
    saveUninitialized: false
}));


app.use(global.mockSession({ id: '123', name: 'Test User', role: 'organizer' }));


const passport = require('./tests/passport.mock');
   

app.use(passport.initialize());
app.use(passport.session());

// Routes
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Community Event Management System API' });
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

module.exports = app;

