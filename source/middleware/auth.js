var redis = require('redis'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;



// send 401 if not authenticated, otherwise proceed
var auth = function(req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};




module.exports = {
    auth: auth,
    