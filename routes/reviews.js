const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const validate = require('../middleware/validate');
const { isAuthenticated, isAuthorized } = require('../middleware/auth');

router.get('/', reviewController.getAllReviews);

router.get('/:id',
    validate([param('id').isMongoId().withMessage('Invalid review ID')]),
    reviewController.getReviewById
);

router.use(isAuthenticated);

router.post('/',
    validate([
        body('event').isMongoId().withMessage('Invalid event ID'),
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').notEmpty().withMessage('Comment is required')
    ]),
    reviewController.createReview
);

router.put('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid review ID'),
        body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().notEmpty().withMessage('Comment cannot be empty')
    ]),
    reviewController.updateReview
);

router.delete('/:id',
    isAuthorized(['admin', 'user']),
    validate([param('id').isMongoId().withMessage('Invalid review ID')]),
    reviewController.deleteReview
);

module.exports = router;