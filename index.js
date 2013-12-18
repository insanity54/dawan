// This file handles includes, setup, and initialization


// modules
var express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    path = require('path'),
    nunjucks = require('nunjucks'),
    nconf = require('nconf'),
    redis = require('redis'),
    //jsonify = require('redis-jsonify'),
//    passport = require('passport'),
    middleware = require('./source/middleware');





// connect to redis
var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});

// log errors


// allow use of these specified environment variables (whitelist)
// read the configuration file
nconf.env(['PORT', 'SESSON_SECRET', 'TWITTER_CONSUMER_KEY', 'TWITTER_CONSUMER_SECRET'])
    .file({ file: 'config.json' });

// default configurations if config file does not set them
nconf.defaults({
    'PORT': '8080',
});

// configure the app
app.set('TITLE', nconf.get('TITLE'));
app.set('PORT', nconf.get('PORT'));
app.set('SESSION_SECRET', nconf.get('SESSION_SECRET'));
app.set('TWITTER_CONSUMER_KEY', nconf.get('TWITTER_CONSUMER_KEY'));
app.set('TWITTER_CONSUMER_SECRET', nconf.get('TWITTER_CONSUMER_SECRET'));

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: app.get('SESSION_SECRET') }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.logger('dev')); // @todo for production,  change this
        rclient.on("error", function(err) {
        console.log("Error " + err);
});
app.use(app.router);






// set up nunjucks
nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/public/tpl'),{ autoescape: true });
nunjucksEnv.express(app);

//app.set('views', __dirname + '/tpl');
//app.set('view engine', 'nunjucks');

// pass the secret for signed cookies 
// @todo test: change this once client stores cookie, see if client can still login


// client.set("users", users, function(err, result) {
//     client.get("users", function(err, result) {
//         console.dir(result);
//     });
// });


// serve these static directories
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/public/css')));
app.use(express.static(path.join(__dirname, '/public/js')));
app.use(express.static(path.join(__dirname, '/public/tpl')));
app.use(express.static(path.join(__dirname, '/public/vendor')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap/css')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap/fonts')));
app.use(express.static(path.join(__dirname, '/public/vendor/bootstrap/js')));
app.use(express.static(path.join(__dirname, '/public/vendor/x-editable/bootstrap3-editable/css')));
app.use(express.static(path.join(__dirname, '/public/vendor/x-editable/bootstrap3-editable/img')));
app.use(express.static(path.join(__dirname, '/public/vendor/x-editable/bootstrap3-editable/js')));


// api endpoints
require('./source/api/auth')(app);
//require('./source/api/user')(app);


console.log('App runnin');
server.listen(app.get('PORT'));



//
//
//


// function User() {
//     // connect to redis


// };

// User.prototype.findOrCreate = function(id, fn) {
//     // finds the specified user id. if specified user id doesn't exit, create the user

//     var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});    
    
// DATABASE
//
// account_types:
//   0: free
//   1: premium
//
// idea: users have a 'version' configuration, where they can choose the version of dawan that they use
//
// 'wans' is the number of WAN ports the user has on their router
// 'update_time' is an array of time in milliseconds that the user's client will contact the master server.
//     Each array element is for the user's different WANs. ie each WAN has it's own update interval.



// id = INCR next.user.id

// SET user/$id name john

// GET user/$id name
// "john"



// SET users:$id id
// SET users:$id:account:name 'george henry'
// SET users:$id:account:email george@example.com
// SET users:$id:account:password rosebud
// SET users:$id:account:type 1
// SET users:$id:config:wans 1
// SET users:$id:config:update.time '3000 6000'




// client.set("skey", "hello worldy", redis.print);
// //client.hset("hkey", "hashtest 1", "someval", redis.print);
// client.mset(["test keys 1", "test val 1", "test keys 2", "test val 2"], function (err, res) {});
// client.hset(["hkey", "hashtestt 2", "some other valuee"], redis.print);
// client.hkeys("hkey", function(err, replies) {
//     console.log(replies.length + " replies: ");

//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });






    // client.set("users", users, function(err, result) {
    // client.get("users", function(err, result) {
       // console.dir(result);                                                                                                                 
    //  });
    // });
    //};

//module.exports = User;var redis = require('redis');


// var User = {};

// //User.prototype.findOrCreate = function(id, fn) {

// User.findOrCreate = function(id, fn) {
//     // finds the specified user id. if specified user id doesn't exit, create the user

//     var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});    

//     rclient.get('user/' + id, function(err, reply) {
//         if (err) throw err;
//         if (reply) {
//             console.log('REDIS: reply received: ');
//             console.dir(reply);
//             reply(null, user);
// 	}
//     });

//     rclient.quit();
//     fn(null, user);

// }




// DATABASE
//
// account_types:
//   0: free
//   1: premium
//
// idea: users have a 'version' configuration, where they can choose the version of dawan that they use
//
// 'wans' is the number of WAN ports the user has on their router
// 'update_time' is an array of time in milliseconds that the user's client will contact the master server.
//     Each array element is for the user's different WANs. ie each WAN has it's own update interval.



