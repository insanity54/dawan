
// INCLUDES
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var redis = require('redis');
var nunjucks = require('nunjucks');
var cors = require('cors');

var red = redis.createClient(null, null, {"retry_max_delay": "180000"});

red.on("error", function(err) {
    console.log("Error " + err);
});



// use these environment variables
nconf.env(['port', 'secret', 'password'])
     .file({ file: 'config.json' });


nconf.defaults({
    'port': '8080',
});


// set some app-wide vars
app.set('title', 'Dwane.co');
app.set('port', nconf.get('port'));
app.use(cors()); // CORS



// nunjucks templating
nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/tpl'), { autoescape: true });
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




var users = {
    "account": {
        "name": "george henry",
        "email": "george@example.com",
        "password": "taco",
        "type": 1,
    },

    "config": {
        "wans": "1",
        "update_time": [
            3000, 6000
        ]
    }
} 

// client.set("users", users, function(err, result) {
//     client.get("users", function(err, result) {
// 	console.log('result: ');
//         console.dir(result);
//     });
// });



//
// ROUTES
//
app.get("/", function(req, res) {
    res.send('hello thank you for visiting');
});

app.get("/secret", function(req, res) {
    res.send(nconf.get('secret'));
});

app.get("/api/config/:uid", function(req, res) {
    var uid = req.params.uid;
    var ip = req.connection.remoteAddress;

    // @todo authenticate request
    // @todo if authenticated
    //   red.SET('user/' + uid + '/ip', req.usersIpAddress // @todo set users IP address to the requesting IP.
    //   @todo send user's config to requesting client
    
    console.log("uid retrieved: " + uid);
    console.log("user IP: " + ip);
    res.send("uid retrieved: " + uid);
});
    

app.use(express.static(__dirname + '/public'));

console.log('server listening on port ' + nconf.get('port'));
server.listen(nconf.get('port'));