'use strict';

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const conf = require('./config');

// Enable CORS
app.use(cors());

// Enable body parser middleware
app.use(bodyParser.text({ limit: '1mb' })); // def 100kb
app.use(bodyParser.json({ limit: '1mb' }));
app.use((function (req, res, next) {
    console.log("[" + new Date() + "] " + req.method + " " + req.path + " [" + req.ip + " - " + req.get("User-Agent") + "]");
    next();
}));

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
var userPart = '';
if (conf.mongo.username) {
    userPart = conf.mongo.username;
    if (conf.mongo.password) {
        userPart += ":" + conf.mongo.password;
    }
    userPart += '@';
}
mongoose.connect('mongodb://' + userPart + conf.mongo.host + '/' + conf.mongo.database, {useMongoClient: true});

/*
Load Models
 */
require('./api/models/userCollectionModel');
require('./api/models/userProfileModel');

/*
Load Routes
 */
require('./api/routes/userCollectionRoutes')(app, jwtCheck, errorHandler);
require('./api/routes/userProfileRoutes')(app, jwtCheck, errorHandler);

/*
Start Server
 */
app.listen(conf.port);
console.log('Listening on port: ' + conf.port);
