
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

app.get("/api/config/:id", function(req, res) {
    var id = req.params.id;
    var ip = req.connection.remoteAddress;

    // @todo authenticate request
    // @todo if authenticated

    // @todo user can put in a client id
    //         - system will know it's a client ID
    //         - send client configurations
    //
    //       OR
    //
    //       user can put in a User ID
    //         - system knows its a uid
    //         - create identity for this machine
    //         - get this machine's cid or generate one


    var cid = id; // @todo id type will be detected
                  //       and turned into cid or uid dynamically

    // unregistered cid?
    red.GET('client/' + cid + '/owner', function(err, uid) {
	if (err) throw err;

	console.log("cid retrieved: " + cid);
	console.log("user IP: " + ip);
	console.log('user: ' + uid);
	
	if (uid == 'nil' || uid == null) {
	    // client is unregistered
	    console.log('client ' + cid + ' is unregistered');

	    // @todo create a temporary account for the unreg user
	    res.send('unregistered user ID!');

	} else {
	    // user exists in system
	    // store user's reported IP along with the time & date
	    var epoch = (new Date).getTime();

	    // lifetime history of IPs this client has reported
	    red.ZADD('user/' + uid + '/ip/lifetimez', epoch, ip, function(err, reply) {
		if (err) throw err;
		console.log('added user ' + uid +
			    '\'s ip ' + ip +
			    ' from client id ' + cid);

		// recent history of IPs this client has reported
		red.RPUSH('user/' + uid + '/ip/recents', ip + ' ' + epoch, function(err, reply) {
		    if (err) throw err;
		    console.log('recent history added');
		    
		    //   @todo send user's config to requesting client
		    red.GET('client/' + cid + '/config/update-interval', function(err, u) {
			
			if (err) throw err;
			if (u != null) {
			    // we have the update interval	    
			    res.json({
				"cid": cid,
				"ip": ip,
				"update-interval": u
			    });
			    
			} else {
			    // update interval is not configured
			    res.send('Hello, ' + cid + '. We logged your IP ' + ip);
			}
		    });
		});

	    });
	}
    });
});

    

app.use(express.static(__dirname + '/public'));

console.log('server listening on port ' + nconf.get('port'));
server.listen(nconf.get('port'));