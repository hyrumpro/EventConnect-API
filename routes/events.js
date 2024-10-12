const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const eventController = require('../controllers/eventController');
const validate = require('../middleware/validate');


router.get('/', eventController.getAllEvents);

router.get('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid event ID')
    ]),
    eventController.getEventById
);

router.post('/',
    validate([
        body('title').notEmpty().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('date').isISO8601().toDate().withMessage('Invalid date'),
        body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
        body('location').notEmpty().withMessage('Location is required'),
        body('organizer').isMongoId().withMessage('Invalid organizer ID'),
        body('category').notEmpty().withMessage('Category is required'),
        body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
        body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
    ]),
    eventController.createEvent
);

router.put('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid event ID'),
        body('title').optional().notEmpty().withMessage('Title cannot be empty'),
        body('description').optional().notEmpty().withMessage('Description cannot be empty'),
        body('date').optional().isISO8601().toDate().withMessage('Invalid date'),
        body('time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
        body('location').optional().notEmpty().withMessage('Location cannot be empty'),
        body('organizer').optional().isMongoId().withMessage('Invalid organizer ID'),
        body('category').optional().notEmpty().withMessage('Category cannot be empty'),
        body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
        body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number')
    ]),
    eventController.updateEvent
);

router.delete('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid event ID')
    ]),
    eventController.deleteEvent
);

module.exports = router;