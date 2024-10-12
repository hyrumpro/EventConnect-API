const Event = require('../models/Event');

exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate('organizer', 'name email');
        res.json(events);
    } catch (error) {
        next(error);
    }
};

exports.getEventById = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');
        if (!event) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(event);
    } catch (error) {
        next(error);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

exports.updateEvent = async (req, res, next) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedEvent) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(updatedEvent);
    } catch (error) {
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

exports.deleteEvent = async (req, res, next) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        next(error);
    }
};