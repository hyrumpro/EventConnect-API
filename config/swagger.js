const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Event Management API',
            version: '1.0.0',
            description: 'API documentation for the Event Management system',
        },
        servers: [
            {
                url: 'https://eventconnect-api.onrender.com/',
                description: 'Production server',
            },

        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                },
            },
            schemas: {
                Ticket: {
                    type: 'object',
                    required: ['_id', 'event', 'status', 'createdAt', 'updatedAt'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The auto-generated ID of the ticket',
                            example: '60d0fe4f5311236168a109ca',
                        },
                        event: {
                            type: 'string',
                            description: 'The ID of the associated event',
                            example: '60d0fe4f5311236168a109cb',
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'used', 'cancelled'],
                            description: 'The status of the ticket',
                            example: 'active',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                    },
                },
                TicketInput: {
                    type: 'object',
                    required: ['event'],
                    properties: {
                        event: {
                            type: 'string',
                            description: 'The ID of the associated event',
                            example: '60d0fe4f5311236168a109cb',
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'used', 'cancelled'],
                            description: 'The status of the ticket',
                            example: 'active',
                        },
                    },
                },
                TicketUpdate: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            enum: ['active', 'used', 'cancelled'],
                            description: 'The status of the ticket',
                            example: 'used',
                        },
                    },
                },

                Event: {
                    type: 'object',
                    required: [
                        '_id',
                        'title',
                        'description',
                        'date',
                        'time',
                        'location',
                        'category',
                        'capacity',
                        'price',
                        'createdAt',
                        'updatedAt',
                    ],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The auto-generated ID of the event',
                            example: '60d0fe4f5311236168a109cc',
                        },
                        title: {
                            type: 'string',
                            description: 'Title of the event',
                            example: 'Tech Conference 2024',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the event',
                            example: 'A conference about the latest in technology.',
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Date of the event',
                            example: '2024-05-20',
                        },
                        time: {
                            type: 'string',
                            description: 'Time of the event (HH:MM format)',
                            example: '09:00',
                        },
                        location: {
                            type: 'string',
                            description: 'Location of the event',
                            example: 'Convention Center, Cityville',
                        },
                        category: {
                            type: 'string',
                            description: 'Category of the event',
                            example: 'Technology',
                        },
                        capacity: {
                            type: 'integer',
                            description: 'Maximum number of attendees',
                            example: 500,
                        },
                        price: {
                            type: 'number',
                            description: 'Price per ticket',
                            example: 99.99,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                    },
                },
                EventInput: {
                    type: 'object',
                    required: [
                        'title',
                        'description',
                        'date',
                        'time',
                        'location',
                        'category',
                        'capacity',
                        'price',
                    ],
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the event',
                            example: 'Tech Conference 2024',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the event',
                            example: 'A conference about the latest in technology.',
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Date of the event',
                            example: '2024-05-20',
                        },
                        time: {
                            type: 'string',
                            description: 'Time of the event (HH:MM format)',
                            example: '09:00',
                        },
                        location: {
                            type: 'string',
                            description: 'Location of the event',
                            example: 'Convention Center, Cityville',
                        },
                        category: {
                            type: 'string',
                            description: 'Category of the event',
                            example: 'Technology',
                        },
                        capacity: {
                            type: 'integer',
                            description: 'Maximum number of attendees',
                            example: 500,
                        },
                        price: {
                            type: 'number',
                            description: 'Price per ticket',
                            example: 99.99,
                        },
                    },
                },
                EventUpdate: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'Title of the event',
                            example: 'Updated Tech Conference 2024',
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the event',
                            example: 'An updated description about the latest in technology.',
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Date of the event',
                            example: '2024-06-15',
                        },
                        time: {
                            type: 'string',
                            description: 'Time of the event (HH:MM format)',
                            example: '10:00',
                        },
                        location: {
                            type: 'string',
                            description: 'Location of the event',
                            example: 'Updated Convention Center, Cityville',
                        },
                        category: {
                            type: 'string',
                            description: 'Category of the event',
                            example: 'Innovation',
                        },
                        capacity: {
                            type: 'integer',
                            description: 'Maximum number of attendees',
                            example: 600,
                        },
                        price: {
                            type: 'number',
                            description: 'Price per ticket',
                            example: 149.99,
                        },
                    },
                },

                Review: {
                    type: 'object',
                    required: [
                        '_id',
                        'event',
                        'rating',
                        'comment',
                        'user',
                        'createdAt',
                        'updatedAt',
                    ],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The auto-generated ID of the review',
                            example: '60d0fe4f5311236168a109cd',
                        },
                        event: {
                            type: 'string',
                            description: 'The ID of the associated event',
                            example: '60d0fe4f5311236168a109cb',
                        },
                        rating: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            description: 'Rating between 1 and 5',
                            example: 4,
                        },
                        comment: {
                            type: 'string',
                            description: 'Review comment',
                            example: 'Great event with insightful talks!',
                        },
                        user: {
                            type: 'string',
                            description: 'The ID of the user who wrote the review',
                            example: '60d0fe4f5311236168a109ce',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                    },
                },
                ReviewInput: {
                    type: 'object',
                    required: ['event', 'rating', 'comment'],
                    properties: {
                        event: {
                            type: 'string',
                            description: 'The ID of the associated event',
                            example: '60d0fe4f5311236168a109cb',
                        },
                        rating: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            description: 'Rating between 1 and 5',
                            example: 5,
                        },
                        comment: {
                            type: 'string',
                            description: 'Review comment',
                            example: 'Absolutely fantastic event!',
                        },
                    },
                },
                ReviewUpdate: {
                    type: 'object',
                    properties: {
                        rating: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 5,
                            description: 'Rating between 1 and 5',
                            example: 4,
                        },
                        comment: {
                            type: 'string',
                            description: 'Review comment',
                            example: 'Updated comment: Still a great event!',
                        },
                    },
                },

                User: {
                    type: 'object',
                    required: ['_id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The auto-generated ID of the user',
                            example: '60d0fe4f5311236168a109cf',
                        },
                        name: {
                            type: 'string',
                            description: 'Name of the user',
                            example: 'John Doe',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            example: 'johndoe@example.com',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'organizer', 'admin'],
                            description: 'Role of the user',
                            example: 'admin',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last update timestamp',
                            example: '2023-07-21T17:32:28Z',
                        },
                    },
                },
                UserInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Name of the user',
                            example: 'Jane Smith',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            example: 'janesmith@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Password for the user account',
                            example: 'password123',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'organizer', 'admin'],
                            description: 'Role of the user',
                            example: 'user',
                        },
                    },
                },
                UserUpdate: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            description: 'Name of the user',
                            example: 'Jane Doe',
                        },
                        email: {
                            type: 'string',
                            description: 'Email address of the user',
                            example: 'janedoe@example.com',
                        },
                        password: {
                            type: 'string',
                            description: 'Password for the user account',
                            example: 'newpassword456',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'organizer', 'admin'],
                            description: 'Role of the user',
                            example: 'organizer',
                        },
                    },
                },
            },
        },
    },

    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, { explorer: true })
    );
};

module.exports = setupSwagger;
