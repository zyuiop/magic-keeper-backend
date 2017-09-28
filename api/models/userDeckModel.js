'use strict';
var mongoose = require('mongoose');


var UserDeckSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'user id is required'],
        unique: true
    },
    cards: String,
    name: {
        type: String,
        required: [true, 'deck name is required']
    },
    public: {
        type: Boolean,
        default: false
    },
    lastChanged: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('UserDecks', UserDeckSchema);