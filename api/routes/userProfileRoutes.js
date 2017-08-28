'use strict';
module.exports = function(app, jwtCheck, errorHandler) {
    var profile = require('../controllers/userProfileController');

    app.route('/profile')
        .get(jwtCheck, errorHandler, profile.getPersonalProfile)
        .put(jwtCheck, errorHandler, profile.updatePersonalProfile);

    app.route('/profile/:username')
        .get(profile.getUserProfile); // returns 200 + collection OR 403 OR 404

    app.route('/profile/byId/:id')
        .get(profile.getUserProfileById); // returns 200 + collection OR 403 OR 404
};