// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retrieve a list of all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', eventController.getAllEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid event ID
 *       404:
 *         description: Event not found
 */
router.get('/:id',
    validate([param('id').isMongoId().withMessage('Invalid event ID')]),
    eventController.getEventById
);

router.use(isAuthenticated);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/',
    isAuthorized(['organizer', 'admin']),
    validate([
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('date').isISO8601().toDate().withMessage('Invalid date'),
        body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
        body('location').notEmpty().withMessage('Location is required'),
        body('category').notEmpty().withMessage('Category is required'),
        body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
    ]),
    eventController.createEvent
);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventUpdate'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.put('/:id',
    isAuthorized(['organizer', 'admin']),
    validate([
        param('id').isMongoId().withMessage('Invalid event ID'),
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('description').optional().notEmpty().withMessage('Description cannot be empty'),
        body('date').optional().isISO8601().toDate().withMessage('Invalid date'),
        body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
        body('location').optional().notEmpty().withMessage('Location cannot be empty'),
        body('category').optional().notEmpty().withMessage('Category cannot be empty'),
        body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
    ]),
    eventController.updateEvent
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       400:
 *         description: Invalid event ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
 */
router.delete('/:id',
    isAuthorized(['admin', 'organizer']),
    validate([param('id').isMongoId().withMessage('Invalid event ID')]),
    eventController.deleteEvent
);

module.exports = router;
