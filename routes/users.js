const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const validate = require('../middleware/validate');

router.get('/', userController.getAllUsers);

router.get('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid user ID')
    ]),
    userController.getUserById
);

router.post('/',
    validate([
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['user', 'organizer', 'admin']).withMessage('Invalid role')
    ]),
    userController.createUser
);

router.put('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid user ID'),
        body('name').optional().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Invalid email address'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('role').optional().isIn(['user', 'organizer', 'admin']).withMessage('Invalid role')
    ]),
    userController.updateUser
);

router.delete('/:id',
    validate([
        param('id').isMongoId().withMessage('Invalid user ID')
    ]),
    userController.deleteUser
);

module.exports = router;