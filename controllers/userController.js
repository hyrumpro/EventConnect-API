const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const updateData = { name, email, role };

        if (password) {
            updateData.password = await bcrypt.hash(password, 12);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(updatedUser);
    } catch (error) {
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
};