
// INCLUDES
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var redis = require('redis');
var nunjucks = require('nunjucks');
var cors = require('cors');
var passport = require('passport');

//var passport-google-o

var red = redis.createClient(null, null, {"retry_max_delay": "180000"});

red.on("error", function(err) {
    console.log("Error " + err);
});



// use these environment variables
nconf.env(['PORT', 'SECRET', 'PASSWORD'])
     .file({ file: 'config.json' });


nconf.defaults({
    'PORT': '22454',
});


// set some app-wide vars
app.set('title', 'Dwane.co');
app.set('port', nconf.get('PORT'));
app.set('thirty7ClientId', nconf.get('THIRTY7CLIENTID'));
app.set('thirty7ClientSecret', nconf.get('THIRTY7CLIENTSECRET'));
app.set('thirty7CallbackUrl', nconf.get('THIRTY7CALLBACKURL'));
app.use(cors()); // CORS
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'omgwer123 changeme' }));
app.use(passport.initialize());
app.use(passport.session());


	



// nunjucks templating
nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/public'), { autoescape: true });
nunjucksEnv.express(app);

// express stuff
app.use(express.logger('dev'));


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



// id = INCR next.users.id

// SET users:$id:account:name 'george henry'
// SET users:$id:account:email george@example.com
// SET users:$id:account:password rosebud
// SET users:$id:account:type 1
// SET users:$id:config:wans 1
// SET users:$id:config:update.time '3000 6000'




// var users = {
//     "account": {
//         "name": "george henry",
//         "email": "george@example.com",
//         "password": "taco",
//         "type": 1,
//     },

//     "config": {
//         "wans": "1",
//         "update_time": [
//             3000, 6000
//         ]
//     }
// } 





// api endpoints
require('./api/client')(app);    // updater client interface
require('./api/auth')(app);      // user authentication
require('./api/cp')(app);        // user/admin web-based control panel




console.log('server listening on port ' + nconf.get('PORT'));
server.listen(nconf.get('PORT'));