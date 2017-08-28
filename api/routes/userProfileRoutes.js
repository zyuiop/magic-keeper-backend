'use strict';

/**
 * @api {get} /profile Get User profile
 * @apiDescription Return the profile of the current user
 * @apiVersion 0.0.1
 * @apiName GetProfile
 * @apiGroup Profile
 * @apiHeader {String} Authorization the access-token provided by auth0
 *
 * @apiSuccess {String} userId auth0 userId of the user.
 * @apiSuccess {String} username name of the user.
 * @apiSuccess {String} _id mongo objectid of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "userId": "auth0|af731fcde45f9713ac3fde",
 *       "username": "zyuiop",
 *       "_id": "78d58e8fc31",
 *     }
 * @apiSuccessExample Success-Response with no profile:
 *     HTTP/1.1 200 OK
 *     null
 */

/**
 * @api {get} /profile/:username Get an user profile
 * @apiDescription Return the profile of the user identified by the provided <code>username</code>
 * @apiVersion 0.0.1
 * @apiName GetUserProfile
 * @apiGroup Profile
 *
 * @apiSuccess {String} username name of the user.
 * @apiSuccess {String} _id mongo objectid of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "zyuiop",
 *       "_id": "78d58e8fc31",
 *     }
 * @apiError (Error 404) UserNotFound the user was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound", "message": "User not found"
 *     }
 */

/**
 * @api {get} /profile/byId/:id Get an user profile by its id
 * @apiDescription Return the profile of the user whose mongo _id is <code>id</code>
 * @apiVersion 0.0.1
 * @apiName GetUserProfileById
 * @apiGroup Profile
 *
 * @apiSuccess {String} username name of the user.
 * @apiSuccess {String} _id mongo objectid of the user.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "username": "zyuiop",
 *       "_id": "78d58e8fc31",
 *     }
 * @apiError (Error 404) UserNotFound the user was not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound", "message": "User not found"
 *     }
 */
/**
 * @api {put} /profile Update User profile
 * @apiVersion 0.0.1
 * @apiName UpdateProfile
 * @apiGroup Profile
 * @apiHeader {String} Authorization the access-token provided by auth0
 * @apiParam username the username of the user (matches /[a-zA-Z0-9_-]{3,22}/)
 * @apiParamExample {json} Request-Example:
 * { "username": "my-new-username" }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     OK
 * @apiError (Error 400) NoUpdatedField the request contained no field that could be updated
 * @apiError (Error 400) UsernameAlreadyUsed the chosen username is already used
 * @apiError (Error 400) UsernameIsInvalid the chosen username doesn't match the regex
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "NoUpdatedField", "message": "no updated field"
 *     }
 */
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