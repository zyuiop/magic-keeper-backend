'use strict';


var mongoose = require('mongoose'),
    UserCollectionSchema = mongoose.model('UserCollections'),
    UserProfileSchema = mongoose.model('UserProfiles');

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
        if (/^([0-9]{1,8}\+?:[0-9]{1,8},[0-9]{1,8};)*([0-9]{1,8}\+?:[0-9]{1,8},[0-9]{1,8})?$/.test(req.body.userCollection)) {
            update.userCollection = req.body.userCollection;
            update.lastChanged = new Date();
            update.revision = require('uuid/v4')();
            allowUpsert = true;
        }
    }

    if (req.body.public !== undefined) {
        if (typeof req.body.public === "boolean") {
            update.public = req.body.public;
        }
    }

    if (update === {}) {
        res.contentType("application/json").status(400).send({"error": "NoUpdatedField", "message": "no updated field"});
        return;
    }

    console.log(update);

    UserCollectionSchema.updateOne({userId: userId}, update, {upsert: allowUpsert}, function(err, task) {
        if (err) {
            console.log(err);
            res.contentType("text/plain").status(500).send("Server Error");
        } else {
            res.status(200).contentType("application/json").send({"status" : "ok", "update" : update});
        }
    });
};

/*
Un-authenticated requests
 */
exports.getPublicCollection = function (req, res) {
    UserProfileSchema
        .findOne({username: req.params.username}, function (err, user) {
            if (err) {
                Promise.reject(err);
            } else {
                return user;
            }
        })
        .then((function(user) {
            if (user === null) {
                res.contentType("application/json").status(404).send({"error": "UserNotFound", "message": "the user was not found"});
                return;
            }

            return UserCollectionSchema.findOne({userId: user.userId}, function (err, collection) {
                if (err) {
                    Promise.reject(err);
                    return;
                }

                if (collection === null) {
                    res.contentType("application/json").status(404).send({"error": "CollectionNotFound", "message": "the user exists but has no collection"});
                } else {
                    const returnObject = {
                        username: user.username,
                        public: collection.public,
                        _id: collection._id,
                        revision: collection.revision
                    };

                    if (collection.public) {
                        returnObject.lastChanged = collection.lastChanged;
                        returnObject.userCollection = collection.userCollection;
                    }

                    res.status(200).json(returnObject);
                }
            });
        }), function(err) {
            console.log(err);
            res.status(500).send("Server Error");
        });
};
