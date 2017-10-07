'use strict';

module.exports = function(app, jwtCheck, errorHandler) {
    var decks = require('../controllers/userDecksController');

    app.route('/decks')
        .get(jwtCheck, errorHandler, decks.getPersonalDecks)
        .post(jwtCheck, errorHandler, decks.createDeck); // returns 200 OR 403

    app.route('/decks/:username')
        .get(jwtCheck.opt, errorHandler, decks.getPublicDecks); // returns 200 + decks OR 404

    app.route('/deck/:id')
        .get(jwtCheck.opt, errorHandler, decks.getDeck) // returns 200 + deck OR 403 OR 404
        .delete(jwtCheck, errorHandler, decks.deleteDeck)
        .put(jwtCheck, errorHandler, decks.updateDeck); // returns 200 OR 403

    app.route('/deck/:id/snapshots').put(jwtCheck, errorHandler, decks.makeSnapshot); // returns 200 OR 403

};