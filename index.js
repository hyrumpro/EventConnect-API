const express = require('express');
const cors = require('cors');
const session = require('express-session');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const passport = require('./config/passport');
dotenv.config();

const app = express();


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


connectDB();

const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);



app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Community Event Management System API' });
});


app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
