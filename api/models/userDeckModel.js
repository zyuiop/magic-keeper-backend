'use strict';
var mongoose = require('mongoose');

var snapshotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'snapshot name is required']
    },
    date: {
        type: Date,
        default: new Date()
    },
    cards: String,
    lands: mongoose.Schema.Types.Mixed
});

var UserDeckSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'user id is required']
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
    },
    lands: mongoose.Schema.Types.Mixed,
    snapshots: {
        type: [snapshotSchema],
        default: []
    }
});

module.exports = mongoose.model('UserDecks', UserDeckSchema);