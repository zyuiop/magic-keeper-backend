'use strict';
var mongoose = require('mongoose');


var UserCollectionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'user id is required'],
        unique: true
    },
    userCollection: String,
    publicUrl: {
        type: String,
        unique: true
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

module.exports = mongoose.model('UserCollections', UserCollectionSchema);