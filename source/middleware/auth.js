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





//     // serialize user object to the session
//     // this is called on every authenticated request
//     // and stores the identifying information in the sesion data
//     passport.serializeUser(function(usr, done) {
// 	console.log('ima serializeing');
// 	done(null, usr.id);
//     });


//     // pull the cookie from the user's browser
//     // using the cookie, find who it is that is visiting
//     // pull that user's info from the db
// passport.deserializeUser(function(id, done) {
//     console.log('ima deserializin and the user id is ' + id );
//     findById(id, function (err, usr) {
//         done(err, usr);
//     });
// });




module.exports = auth;
