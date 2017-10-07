'use strict';


const PROJECT = {id: true, cards: true, name: true, public: true, lastChanged: true, username: "$user.username", snapshots: true, userId: 1};
const PROJECT_LIST = {id: true, name: true, public: true, lastChanged: true};
const NAME_FORMAT = /^[a-zA-Z0-9_éèâêàôùö/\\| !?.-]{3,32}$/;
const ID_FORMAT = /^[0-9a-fA-F]{24}$/;
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
        if (NAME_FORMAT.test(req.body.name)) {
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
    update.lastChanged = new Date();

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

    if (! ID_FORMAT.test(deckId)) {
        res.contentType("application/json").status(400).send({"error": "InvalidId", "message": "the provided deck id is not valid"});
        return;
    }

    // Check data
    var update = {};
    if (req.body.cards !== null) {
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
        if (NAME_FORMAT.test(req.body.name)) {
            update.name = req.body.name;
        }
    }

    if (update === {}) {
        res.contentType("application/json").status(400).send({"error": "NoUpdatedField", "message": "no updated field"});
        return;
    }

    update.lastChanged = new Date();

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

function parselands(lands) {
    return {
        islands: +lands.islands,
        mountains: +lands.mountains,
        swamps: +lands.swamps,
        plains: +lands.plains,
        forests: +lands.forests
    }
}

exports.makeSnapshot = function (req, res) {
    var userId = req.user.sub;
    var deckId = req.params.id;

    if (! ID_FORMAT.test(deckId)) {
        res.contentType("application/json").status(400).send({"error": "InvalidId", "message": "the provided deck id is not valid"});
        return;
    }

    // Check data
    var snapshot = {};
    if (req.body.cards !== null) {
        if (/^([0-9]{1,8}\+?:[0-9]{1,8},[0-9]{1,8};)*([0-9]{1,8}\+?:[0-9]{1,8},[0-9]{1,8})?$/.test(req.body.cards)) {
            snapshot.cards = req.body.cards;
        } else {
            res.contentType("application/json").status(400).send({"error": "InvalidFormat", "message": "cards format is invalid"});
            return;
        }
    } else {
        res.contentType("application/json").status(400).send({"error": "NoName", "message": "cards are missing"});
        return;
    }

    if (req.body.name) {
        if (NAME_FORMAT.test(req.body.name)) {
            snapshot.name = req.body.name;
        } else {
            res.contentType("application/json").status(400).send({"error": "InvalidFormat", "message": "name format is invalid"});
            return;
        }
    } else {
        res.contentType("application/json").status(400).send({"error": "NoName", "message": "name is missing"});
        return;
    }

    if (req.body.lands) {
        snapshot.lands = parselands(req.body.lands);
    } else {
        res.contentType("application/json").status(400).send({"error": "NoName", "message": "lands are missing"});
        return;
    }

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

            UserDecksSchema.updateOne({userId: userId, _id: deckId}, { $push : { snapshots : snapshot }}, function(err, task) {
                if (err) {
                    console.log(err);
                    res.contentType("text/plain").status(500).send("Server Error");
                } else {
                    snapshot.status = "ok";
                    snapshot.date = new Date();
                    res.status(200).contentType("application/json").send(snapshot);
                }
            });
        }
    });
};

exports.deleteDeck = function (req, res) {
    var userId = req.user.sub;
    var deckId = req.params.id;

    if (! ID_FORMAT.test(deckId)) {
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

    if (! ID_FORMAT.test(deckId)) {
        res.contentType("application/json").status(400).send({"error": "InvalidId", "message": "the provided deck id is not valid"});
        return;
    }

    UserDecksSchema.aggregate().match({_id: mongoose.Types.ObjectId(deckId)}).lookup({from: "userprofiles", localField: "userId", foreignField: "userId", as: "user"}).project(PROJECT).unwind("username").exec(function (err, docs) {
        if (err) {
            console.log(err);
            res.contentType("text/plain").status(500).send("Server Error");
        } else {
            if (!docs || docs.length === 0) {
                res.contentType("application/json").status(404).send({"error": "DeckNotFound", "message": "cannot see a deck that doesn't exist"});
                return;
            }

            var doc = docs[0];
            if (doc.userId !== userId) {
                if (!doc.public) {
                    res.contentType("application/json").status(userId === null ? 401 : 403).send({
                        "error": "NotOwner",
                        "message": "this deck was found but is not owned by the current user"
                    });
                    return;
                }

                doc.snapshots = undefined;
            }

            doc.userId = undefined;
            res.status(200).json(doc);
        }
    });
};
