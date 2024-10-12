const Review = require('../models/Review');
const Event = require('../models/Event');

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('event', 'title')
            .populate('user', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('event', 'title')
            .populate('user', 'name');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching review', error: error.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { event, user, rating, comment } = req.body;
        const eventExists = await Event.findById(event);
        if (!eventExists) {
            return res.status(404).json({ message: 'Event not found' });
        }
        const newReview = new Review({ event, user, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: 'Error creating review', error: error.message });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('event', 'title')
            .populate('user', 'name');
        if (!updatedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: 'Error updating review', error: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        if (!deletedReview) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};