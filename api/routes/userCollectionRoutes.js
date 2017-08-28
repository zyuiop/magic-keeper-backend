'use strict';

/**
 * @api {get} /collection Get authenticated user Collection
 * @apiDescription Return the collection of the current user
 * @apiVersion 0.0.1
 * @apiName GetCollection
 * @apiGroup Collection
 * @apiHeader {String} Authorization the access-token provided by auth0
 *
 * @apiSuccess {String} userId auth0 userId of the user.
 * @apiSuccess {String} userCollection the collection (format: <code>{card-multiverse-id}:{amount},{amount-foil};(...)</code>)
 * @apiSuccess {boolean} public whether the collection can be accessed by anyone.
 * @apiSuccess {Date} lastChanged the last time this collection was updated.
 * @apiSuccess {String} _id mongo objectid of the collection.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      "_id": "59a448bb8e0e62edaae4bd89",
 *      "userId" : "google-oauth2|369378976795599183570",
 *      "userCollection" : "430731:3,0;430733:1,0;430734:2,0;430735:2,0;430736:2,0;430740:1,0;430742:2,0",
 *      "__v":0,
 *      "lastChanged": "2017-08-28T17:30:38.251Z",
 *      "public":true
 *     }
 * @apiSuccessExample Success-Response with no collection stored:
 *     HTTP/1.1 200 OK
 *     null
 */

/**
 * @api {get} /collection/:username Get an user collection
 * @apiDescription Return the collection of the user identified by the provided <code>username</code>
 * @apiVersion 0.0.1
 * @apiName GetUserCollection
 * @apiGroup Collection
 *
 * @apiSuccess {String} username name of the user.
 * @apiSuccess {String} _id mongo objectid of the collection.
 * @apiSuccess {boolean} public whether the collection can be accessed by anyone.
 * @apiSuccess (Public Collection) {String} userCollection the collection (format: <code>{card-multiverse-id}:{amount},{amount-foil};(...)</code>)
 * @apiSuccess (Public Collection) {Date} lastChanged the last time this collection was updated.
 *
 * @apiSuccessExample Success-Response for a public collection:
 *     HTTP/1.1 200 OK
 *     {
 *      "_id": "59a448bb8e0e62edaae4bd89",
 *      "username": "zyuiop",
 *      "userCollection": "430731:3,0;430733:1,0;430734:2,0;430735:2,0;430736:2,0;430740:1,0;430742:2,0",
 *      "lastChanged": "2017-08-28T17:30:38.251Z",
 *      "public": true
 *     }
 * @apiSuccessExample Success-Response for a private collection:
 *     HTTP/1.1 200 OK
 *     {
 *      "_id": "59a448bb8e0e62edaae4bd89",
 *      "username": "zyuiop",
 *      "public": false
 *     }
 * @apiError (Error 404) UserNotFound the user was not found
 * @apiError (Error 404) CollectionNotFound the user exists but has no collection
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound", "message": "the user was not found"
 *     }
 */
/**
 * @api {put} /collection Update User collection
 * @apiVersion 0.0.1
 * @apiName UpdateCollection
 * @apiGroup Collection
 * @apiHeader {String} Authorization the access-token provided by auth0
 * @apiParam [collection] {string} the user collection, matching the format detailed before
 * @apiParam [public] {boolean} the collection privacy status
 * @apiParamExample {json} Request-Example:
 * { "public": "false" }
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     OK
 * @apiError (Error 400) NoUpdatedField the request contained no field that could be updated
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "NoUpdatedField", "message": "no updated field"
 *     }
 */
module.exports = function(app, jwtCheck, errorHandler) {
    var collection = require('../controllers/userCollectionController');

    app.route('/collection')
        .get(jwtCheck, errorHandler, collection.getPersonalCollection)
        .put(jwtCheck, errorHandler, collection.updatePersonalCollection);

    app.route('/collection/:username')
        .get(collection.getPublicCollection); // returns 200 + collection OR 403 OR 404
};