const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const validate = require('../middleware/validate');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

router.use(isAuthenticated);

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Retrieve a list of all tickets
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: A list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', isAuthorized(['admin', 'organizer']), ticketController.getAllTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ticket ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid ticket ID
 *       404:
 *         description: Ticket not found
 */
router.get('/:id',
    validate([param('id').isMongoId().withMessage('Invalid ticket ID')]),
    ticketController.getTicketById
);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketInput'
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/',
    validate([
        body('event').isMongoId().withMessage('Invalid event ID'),
        body('status').optional().isIn(['active', 'used', 'cancelled']).withMessage('Invalid status')
    ]),
    ticketController.createTicket
);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ticket ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketUpdate'
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ticket not found
 */
router.put('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid ticket ID'),
        body('status').optional().isIn(['active', 'used', 'cancelled']).withMessage('Invalid status')
    ]),
    ticketController.updateTicket
);

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket by ID
 *     tags: [Tickets]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ticket ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       400:
 *         description: Invalid ticket ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Ticket not found
 */
router.delete('/:id',
    isAuthorized(['admin', 'organizer']),
    validate([param('id').isMongoId().withMessage('Invalid ticket ID')]),
    ticketController.deleteTicket
);

module.exports = router;
