require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

beforeAll(async () => {
    try {
        console.log('Initializing MongoMemoryServer...');
        mongod = await MongoMemoryServer.create();
        console.log('MongoMemoryServer instance created.');

        const mongoUri = mongod.getUri();
        console.log(`Connecting to in-memory MongoDB at ${mongoUri}`);

        await mongoose.connect(mongoUri);
        console.log('Connected to in-memory MongoDB');
    } catch (error) {
        console.error('MongoDB setup failed:', error);
        throw error;
    }
});

afterAll(async () => {
    try {
        console.log('Disconnecting from in-memory MongoDB...');
        await mongoose.disconnect();
        if (mongod) {
            console.log('Stopping MongoMemoryServer...');
            await mongod.stop();
        }
        console.log('Disconnected from in-memory MongoDB');
    } catch (error) {
        console.error('MongoDB cleanup failed:', error);
        throw error;
    }
});

beforeEach(async () => {
    try {
        console.log('Clearing all collections...');
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany();
            console.log(`Cleared collection: ${key}`);
        }
    } catch (error) {
        console.error('Collection cleanup failed:', error);
        throw error;
    }
});

// Mock environment variables
process.env = {
    ...process.env,
    NODE_ENV: 'test',
    SESSION_SECRET: 'test-secret',
    GOOGLE_CLIENT_ID: 'mock-client-id',
    GOOGLE_CLIENT_SECRET: 'mock-client-secret'
};

// Mock session middleware
global.mockSession = (user) => {
    return (req, res, next) => {
        req.user = user;
        req.isAuthenticated = () => true;
        next();
    };
};


