'use strict';


var mongoose = require('mongoose'), UserProfileSchema = mongoose.model('UserProfiles');

/*
Authenticated requests
 */
exports.getPersonalProfile = function (req, res) {
    var userId = req.user.sub;
    UserProfileSchema.findOne({userId: userId}, function (err, collection) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            res.status(200).json(collection);
        }
    });
};

exports.updatePersonalProfile = function (req, res) {
    var userId = req.user.sub;

    // Check data
    var update = {};
    var allowUpsert = false;
    if (req.body.username) {
        if (!/^[a-zA-Z0-9_-]{3,22}$/.test(req.body.username)) {
            res.contentType("text/plain").status(400).send("username is invalid");
            return;
        }

        allowUpsert = true;
        update.username = req.body.username;
    }

    if (update === {}) {
        res.contentType("text/plain").status(400).send("no updated field");
        return;
    }

    UserProfileSchema.updateOne({userId: userId}, update, {upsert: allowUpsert}, function(err, task) {
        if (err) {
            if (err.message && err.message.indexOf("duplicate key error") !== -1) {
                res.contentType("text/plain").status(400).send("username is already used");
            } else {
                console.log(err);
                res.contentType("text/plain").status(500).send("Server Error");
            }
        } else {
            res.status(200)
                .contentType("text/plain")
                .send("OK");
        }
    });
};

/*
Un-authenticated requests
 */
exports.getUserProfile = function (req, res) {
    UserProfileSchema.findOne({username: req.params.username}, function (err, collection) {
        if (err)
            res.send(err);

        if (collection === null) {
            res.contentType("text/plain").status(404).send("User not found");
        } else {
            collection.__v = undefined;
            collection.userId = undefined;
            res.status(200).json(collection);
        }
    });
};

exports.getUserProfileById = function (req, res) {
    UserProfileSchema.findOne({_id: req.params.id}, function (err, collection) {
        if (err)
            res.send(err);

        if (collection === null) {
            res.contentType("text/plain").status(404).send("User not found");
        } else {
            collection.__v = undefined;
            collection.userId = undefined;
            res.status(200).json(collection);
        }
    });
};
