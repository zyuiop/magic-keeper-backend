'use strict';
var mongoose = require('mongoose');


var UserCollectionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'user id is required'],
        unique: true
    },
    userCollection: String,
    revision: String,
    public: {
        type: Boolean,
        default: false
    },
    lastChanged: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('UserCollections', UserCollectionSchema);