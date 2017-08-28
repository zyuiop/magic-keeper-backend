'use strict';


var mongoose = require('mongoose'), UserCollectionSchema = mongoose.model('UserCollections');

/*
Authenticated requests
 */
exports.getPersonalCollection = function (req, res) {
    var userId = req.user.sub;
    UserCollectionSchema.findOne({userId: userId}, function (err, collection) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            res.status(200).json(collection);
        }
    });
};

exports.updatePersonalCollection = function (req, res) {
    var userId = req.user.sub;

    // Check data
    var update = {};
    var allowUpsert = false;
    if (req.body.userCollection) {
        // TODO: check (type and data)
        update.userCollection = req.body.userCollection;
        allowUpsert = true;
    }

    if (req.body.publicUrl) {
        // TODO: check (type and data)
        update.publicUrl = req.body.publicUrl;
    }

    if (req.body.public) {
        // TODO: check (type and data)
        update.public = req.body.public;
    }

    UserCollectionSchema.updateOne({userId: userId}, update, {upsert: allowUpsert}, function(err, task) {
        if (err) {
            if (err.message && err.message.indexOf("duplicate key error") !== -1) {
                res.contentType("text/plain").status(400).send("publicUrl already used");
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
exports.getPublicCollection = function (req, res) {
    UserCollectionSchema.findOne({publicUrl: req.params.publicUrl}, function (err, collection) {
        if (err)
            res.send(err);

        if (collection === null) {
            res.contentType("text/plain").status(404).send("Collection not found");
        } else {
            collection.userId = undefined;
            collection.__v = undefined;
            if (!collection.public) {
                collection.lastChanged = undefined;
                collection.userCollection = undefined;
            }
            res.status(200).json(collection);
        }
    });
};
