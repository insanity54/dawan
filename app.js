
// INCLUDES
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var redis = require('redis');
var jsonify = require('redis-jsonify');


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


nconf.defaults({
    'port': '8080',
});



// redis helper function to stringify an object
// thanks to http://stackoverflow.com/questions/18942089/storing-nested-javascript-objects-in-redis-nodejs
// and node-memcached for the following two functions (see license ./LICENSE_node-memcached)
var stringify = function(value) {
    if (Buffer.isBuffer(value)) {
	flag = FLAG_BINARAY;
	value = value.toString('binary');

    } else if (valuetype === 'number') {
	flag = FLAG_NUMERIC;
	value = value.toString();

    } else if (valuetype !== 'string') {
	flag = FLAG_JSON;
	value = JSON.stringify(value);
    }
}

var parse = function(flag) {
    switch (flag) {
    case FLAG_JSON:
        
        dataSet = JSON.parse(dataSet);
        break;
    case FLAG_NUMERIC:
        dataSet = +dataSet;
        break;
    case FLAG_BINARY:
        tmp = new Buffer(dataSet.length);
        tmp.write(dataSet, 0, 'binary');
        dataSet = tmp;
        break;
    }
}

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

client.set("users", users, function(err, result) {
    client.get("users", function(err, result) {
        console.dir(result);
    });
});


app.set('views', __dirname + '/tpl');
app.set('view engine', "nunjucks");


//
// ROUTES
//
app.get("/", function(req, res) {
    res.send('hello thank you for visiting');
});

app.get("/secret", function(req, res) {
    res.send(nconf.get('secret'));
});

app.use(express.static(__dirname + '/public'));

server.listen(nconf.get('port'));