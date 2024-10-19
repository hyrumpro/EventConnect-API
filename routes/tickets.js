const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const validate = require('../middleware/validate');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');

router.use(isAuthenticated);

router.get('/', isAuthorized(['admin', 'organizer']), ticketController.getAllTickets);

router.get('/:id',
    validate([param('id').isMongoId().withMessage('Invalid ticket ID')]),
    ticketController.getTicketById
);

router.post('/',
    validate([
        body('event').isMongoId().withMessage('Invalid event ID'),
        body('status').optional().isIn(['active', 'used', 'cancelled']).withMessage('Invalid status')
    ]),
    ticketController.createTicket
);

router.put('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid ticket ID'),
        body('status').optional().isIn(['active', 'used', 'cancelled']).withMessage('Invalid status')
    ]),
    ticketController.updateTicket
);

router.delete('/:id',
    isAuthorized(['admin', 'organizer']),
    validate([param('id').isMongoId().withMessage('Invalid ticket ID')]),
    ticketController.deleteTicket
);

module.exports = router;