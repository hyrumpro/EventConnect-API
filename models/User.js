const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true  // This allows the field to be unique but optional
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'organizer', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String,
    }
});

userSchema.methods.isGoogleUser = function() {
    return Boolean(this.googleId);
};

module.exports = mongoose.model('User', userSchema);