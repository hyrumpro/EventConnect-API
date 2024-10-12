const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const ticketController = require('../controllers/ticketController');
const validate = require('../middleware/validate');

router.get('/', ticketController.getAllTickets);

router.get('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid ticket ID')
    ]),
    ticketController.getTicketById
);

router.post('/',
    validate([
        body('event').isMongoId().withMessage('Invalid event ID'),
        body('user').isMongoId().withMessage('Invalid user ID'),
        body('status').optional().isIn(['active', 'used', 'cancelled']).withMessage('Invalid status')
    ]),
    ticketController.createTicket
);

router.put('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid ticket ID'),
        body('event').optional().isMongoId().withMessage('Invalid event ID'),
        body('user').optional().isMongoId().withMessage('Invalid user ID'),
        body('status').optional().isIn(['active', 'used', 'cancelled']).withMessage('Invalid status')
    ]),
    ticketController.updateTicket
);

router.delete('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid ticket ID')
    ]),
    ticketController.deleteTicket
);

module.exports = router;