'use strict';
var mongoose = require('mongoose');


var UserProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'user id is required'],
        unique: true
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true
    }
});

module.exports = mongoose.model('UserProfiles', UserProfileSchema);