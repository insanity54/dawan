
// INCLUDES
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var path = require('path');
var nunjucks = require('nunjucks');
var nconf = require('nconf');
var redis = require('redis');
var jsonify = require('redis-jsonify');
var passport = require('passport');

var client = redis.createClient(null, null, {"retry_max_delay": "180000"});

client.on("error", function(err) {
    console.log("Error " + err);
});


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


// use these environment variables
nconf.env(['port', 'secret', 'password'])
     .file({ file: 'config.json' });


// defaults if config file does not set them
nconf.defaults({
    'port': '8080',
});





// set up nunjucks
nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader(__dirname + '/public/tpl'),{ autoescape: true });
nunjucksEnv.express(app);


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



app.use(express.logger('dev')); // @todo for production,  change this

// pass the secret for signed cookies 
// @todo test: change this once client stores cookie, see if client can still login
app.use(express.cookieParser('fafsaislikeawaytogetmoniesforschool'));

// populate req.session
app.use(express.session());

client.set("users", users, function(err, result) {
    client.get("users", function(err, result) {
        console.dir(result);
    });
});


app.set('views', __dirname + '/tpl');
app.set('view engine', 'nunjucks');


//
// MIDDLEWARE
//

// Auth
function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'You do not have permission to access this page';
        res.redirect('/login');
    }
}



//
// ROUTES
//
app.get("/", function(req, res) {
//    console.dir(req.headers.host);
    res.render('index.html', { title: 'Dwane', hostname: req.headers.host });
});

app.get('/test', function(req, res) {
    var body = '';
    if (req.session.poops) {
        console.dir(req.session);
	++req.session.poops;
    } else {
        req.session.poops = 1;
        body += '<p>First time pooping? view this page in several browsers D: </p>';
    }
    res.send(body + '<p>viewed <strong>' + req.session.poops + '</strong> times.</p>');
});


app.get("/secret", restrict, function(req, res) {
    res.send(nconf.get('secret') + ' <a href="/logout">log</a>');
});

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


server.listen(nconf.get('port'));