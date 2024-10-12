const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

exports.getAllTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find()
            .populate('event', 'title date')
            .populate('user', 'name email');
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};

exports.getTicketById = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('event', 'title date')
            .populate('user', 'name email');
        if (!ticket) {
            const error = new Error('Ticket not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(ticket);
    } catch (error) {
        next(error);
    }
};

exports.createTicket = async (req, res, next) => {
    try {
        const { event, user } = req.body;
        const eventExists = await Event.findById(event);
        if (!eventExists) {
            const error = new Error('Event not found');
            error.statusCode = 404;
            throw error;
        }
        const newTicket = new Ticket(req.body);
        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

exports.updateTicket = async (req, res, next) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('event', 'title date').populate('user', 'name email');

        if (!updatedTicket) {
            const error = new Error('Ticket not found');
            error.statusCode = 404;
            throw error;
        }
        res.json(updatedTicket);
    } catch (error) {
        if (error.name === 'ValidationError') {
            error.statusCode = 400;
        }
        next(error);
    }
};

exports.deleteTicket = async (req, res, next) => {
    try {
        const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
        if (!deletedTicket) {
            const error = new Error('Ticket not found');
            error.statusCode = 404;
            throw error;
        }
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        next(error);
    }
};