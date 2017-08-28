'use strict';
module.exports = function(app, jwtCheck, errorHandler) {
    var collection = require('../controllers/userCollectionController');

    app.route('/collection')
        .get(jwtCheck, errorHandler, collection.getPersonalCollection)
        .put(jwtCheck, errorHandler, collection.updatePersonalCollection);

    app.route('/collection/:publicUrl')
        .get(collection.getPublicCollection); // returns 200 + collection OR 403 OR 404
};