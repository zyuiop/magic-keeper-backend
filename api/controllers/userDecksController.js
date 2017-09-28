'use strict';


const PROJECT = {cards: true, name: true, public: true, lastChanged: true};
const PROJECT_LIST = {name: true, public: true, lastChanged: true};
var mongoose = require('mongoose'),
    UserDecksSchema = mongoose.model('UserDecks'),
    UserProfileSchema = mongoose.model('UserProfiles');

/*
Authenticated requests
 */
exports.getPersonalDecks = function (req, res) {
    var userId = req.user.sub;
    UserDecksSchema.find({userId: userId}, PROJECT_LIST, function (err, decks) {
        if (err) {
            console.log(err);
            res.status(500).send("Server Error");
        } else {
            res.status(200).json(decks);
        }
    });
};


exports.createDeck = function (req, res) {
    var userId = req.user.sub;

    // Check data
    var update = {};
    if (req.body.name) {
        if (/^[a-zA-Z0-9_ !?.-]{3,32}$/.test(req.body.name)) {
            update.name = req.body.name;
        } else {
            res.contentType("application/json").status(400).send({"error": "InvalidFormat", "message": "name format is invalid"});
            return;
        }
    } else {
        res.contentType("application/json").status(400).send({"error": "NoName", "message": "name is missing"});
        return;
    }

    update.userId = userId;
    update.lastUpdated = new Date();

    new UserDecksSchema(update).save(function (err, deck) {
        if (err) {
            console.log(err);
            res.contentType("text/plain").status(500).send("Server Error");
        } else {
            res.contentType("application/json").status(200).send({"success": true, "objectId" : deck.id});
        }
    });
};

exports.updateDeck = function (req, res) {
    var userId = req.user.sub;
    var deckId = req.params.id;

    if (! /^[0-9a-fA-F]{12}$/.test(deckId)) {
        res.contentType("application/json").status(400).send({"error": "InvalidId", "message": "the provided deck id is not valid"});
        return;
    }

    // Check data
    var update = {};
    if (req.body.cards) {
        if (/^([0-9]{1,8}\+?:[0-9]{1,8},[0-9]{1,8};)*([0-9]{1,8}\+?:[0-9]{1,8},[0-9]{1,8})?$/.test(req.body.cards)) {
            update.cards = req.body.cards;
        }
    }

    if (req.body.public !== undefined) {
        if (typeof req.body.public === "boolean") {
            update.public = req.body.public;
        }
    }

    if (req.body.name) {
        if (/^[a-zA-Z0-9_ !?.-]{3,32}$/.test(req.body.name)) {
            update.name = req.body.name;
        }
    }

    if (update === {}) {
        res.contentType("application/json").status(400).send({"error": "NoUpdatedField", "message": "no updated field"});
        return;
    }

    update.lastUpdated = new Date();

    UserDecksSchema.findById(deckId, function (err, doc) {
        if (err) {
            console.log(err);
            res.contentType("text/plain").status(500).send("Server Error");
        } else {
            if (!doc) {
                res.contentType("application/json").status(404).send({"error": "DeckNotFound", "message": "cannot modify a deck that doesn't exist"});
                return;
            }

            if (doc.userId !== userId) {
                res.contentType("application/json").status(403).send({"error": "NotOwner", "message": "cannot modify a deck owned by someone else"});
                return;
            }

            UserDecksSchema.updateOne({userId: userId, _id: deckId}, update, function(err, task) {
                if (err) {
                    console.log(err);
                    res.contentType("text/plain").status(500).send("Server Error");
                } else {
                    res.status(200).contentType("text/plain").send("OK");
                }
            });
        }
    });
};

exports.deleteDeck = function (req, res) {
    var userId = req.user.sub;
    var deckId = req.params.id;

    if (! /^[0-9a-fA-F]{12}$/.test(deckId)) {
        res.contentType("application/json").status(400).send({"error": "InvalidId", "message": "the provided deck id is not valid"});
        return;
    }

    UserDecksSchema.findById(deckId, function (err, doc) {
        if (err) {
            console.log(err);
            res.contentType("text/plain").status(500).send("Server Error");
        } else {
            if (doc === null) {
                res.contentType("application/json").status(404).send({"error": "DeckNotFound", "message": "cannot modify a deck that doesn't exist"});
                return;
            }

            if (doc.userId !== userId) {
                res.contentType("application/json").status(403).send({"error": "NotOwner", "message": "cannot modify a deck owned by someone else"});
                return;
            }

            UserDecksSchema.deleteOne({userId: userId, _id: deckId}, function(err, task) {
                if (err) {
                    console.log(err);
                    res.contentType("text/plain").status(500).send("Server Error");
                } else {
                    res.status(200).contentType("text/plain").send("OK");
                }
            });
        }
    });
};

/*
Un-authenticated requests
 */
exports.getPublicDecks = function (req, res) {
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

            UserDecksSchema.find({userId: user.userId, public: true}, PROJECT_LIST, function (err, decks) {
                if (err) {
                    Promise.reject(err);
                } else {
                    res.status(200).json(decks);
                }
            });
        }), function(err) {
            console.log(err);
            res.status(500).send("Server Error");
        });
};

exports.getDeck = function (req, res) {
    var userId = (req.user ? req.user.sub : null);
    var deckId = req.params.id;

    if (! /^[0-9a-fA-F]{12}$/.test(deckId)) {
        res.contentType("application/json").status(400).send({"error": "InvalidId", "message": "the provided deck id is not valid"});
        return;
    }

    UserDecksSchema.findById(deckId, PROJECT, function (err, doc) {
        if (err) {
            console.log(err);
            res.contentType("text/plain").status(500).send("Server Error");
        } else {
            if (!doc) {
                res.contentType("application/json").status(404).send({"error": "DeckNotFound", "message": "cannot modify a deck that doesn't exist"});
                return;
            }

            if (doc.userId !== userId) {
                res.contentType("application/json").status(userId === null ? 401 : 403).send({"error": "NotOwner", "message": "this deck was found but is not owned by the current user"});
                return;
            }
            res.status(200).json(doc);
        }
    });
};
