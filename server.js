'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conf = require('config.js');


// Enable CORS
app.use(cors());

// Enable body parser middleware
app.use(bodyParser.text());
app.use(bodyParser.json());

// Prepare tokens checker
var jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://" + conf.auth0.domain + "/.well-known/jwks.json"
    }),
    audience: conf.auth0.audience,
    issuer: "https://" + conf.auth0.domain + "/",
    algorithms: ['RS256']
});

var errorHandler = (function (err, req, res, next) {
    if (!res.headersSent) {
        res = res.contentType("text/plain");
    }
    res.status(err.status).send(err.message);
    next(err);
});

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + conf.mongo.username + ':' + conf.mongo.password + '@' + conf.mongo.host + '/' + conf.mongo.database, {useMongoClient: true});

/*
Load Models
 */
require('./api/models/userCollectionModel');

/*
Load Routes
 */
require('./api/routes/userCollectionRoutes')(app, jwtCheck, errorHandler); // Register routes

/*
Start Server
 */
app.listen(conf.port);
console.log('Listening on port: ' + conf.port);
