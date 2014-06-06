
// INCLUDES
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var nconf = require('nconf');
var redis = require('redis');
var nunjucks = require('nunjucks');
var cors = require('cors');

//var passport = require('passport');
//var passport-google-o

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

// app.get("/secret", function(req, res) {
//     res.send(nconf.get('secret'));
// });

// var toType = function(obj) {
//     return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
// }

// /**
//  * Get a user's alias and redirect to network
//  * of their updater client
//  */
// app.get("/:alias", function(req, res) {

//     // get owner of alias
//     // use owner to find home ip
//     // redirect visitor to home ip
    
    
//     var alias = req.params.alias;
    
//     red.GET('alias/' + alias + '/owner', function(err, owner) {
// 	// get client IP
	
// 	red.LRANGE('user/1/ip/recentl', -1, -1, function(err, mostRecent) {
// 	    // mostRecent is an array containing a string in the format,
// 	    // "000.000.000.000 tttttttttttt" where 0's are Ip address
// 	    // and ttt is time when the IP address was logged.

// 	    // We only want the IP address in this case,
// 	    // so we get the string (containing ip + time) (array element 0)
// 	    // and split the string at the space, creating another array
// 	    // of the ip [0], and the time [1]. We keep the IP.
// 	    mostRecent = mostRecent[0].split(' ')[0];

// 	    console.log('alias ' + alias + ' most recent: ' + mostRecent);
// 	    console.log(toType(mostRecent));

// 	    res.redirect('http://' + mostRecent);
// 	});
//     });
// });
		
// // @todo user should be able to submit just a client id,
// //       as long as that client ID is already registered on the server
// //
// /**
//  * Updater client is sending us an update
//  *
//  * @todo this should probably be a PUT or PUT not a GET
//  */
// app.get("/api/config/:uid/:cid", function(req, res) {
//     var uid = req.params.uid;
//     var cid = req.params.cid;
//     var ip = req.connection.remoteAddress;

//     // validate uid & cid
//     if (/[a-fA-F0-9]{10}-\d/.test(uid)) {
// 	// uid valid
	
// 	if (/[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}/.test(cid)) {
// 	// cid valid

// 	    // unregistered cid?
// 	    red.GET('client/' + cid + '/owner', function(err, uid) {
// 		if (err) throw err;
		
// 		console.log("cid retrieved: " + cid);
// 		console.log("user IP: " + ip);
// 		console.log('user: ' + uid);

// 		if (uid == 'nil' || uid == null) {
// 		        // client is unregistered
// 		    console.log('client ' + cid + ' is unregistered');

// 		        // @todo create a temporary account for the unreg user
// 		    res.send('unregistered user ID!');

// 		} else {
// 		        // user exists in system
// 		        // store user's reported IP along with the time & date
// 		    var epoch = (new Date).getTime();

// 		        // lifetime history of IPs this client has reported
// 		    red.ZADD('user/' + uid + '/ip/lifetimez', epoch, ip, function(err, reply) {
// 			if (err) throw err;
// 			console.log('added user ' + uid +
// 				        '\'s ip ' + ip +
// 				    ' from client id ' + cid);

// 			// recent history of IPs this client has reported
// 			red.RPUSH('user/' + uid + '/ip/recents', ip + ' ' + epoch, function(err, reply) {
// 			    if (err) throw err;
// 			    console.log('recent history added');

// 			        //   @todo send user's config to requesting client
// 			    red.GET('client/' + cid + '/config/update-interval', function(err, u) {

// 				if (err) throw err;
// 				if (u != null) {
// 				    // we have the update interval    
// 				    res.json({
// 					"cid": cid,
// 					"ip": ip,
// 					"updateInterval": u
// 				    });

// 				} else {
// 				        // update interval is not configured
// 				    res.send('Hello, ' + cid + '. We logged your IP ' + ip);
// 				}
// 			    });
// 			});
// 		    });
// 		}
// 	    });
// 	}
//     }
// });
			


		    
		


	
	    
		   


// /**
//  * A new updater client wants to register with the system
//  */
// app.get("/api/config/:id", function(req, res) {
//     var id = req.params.id;
//     var ip = req.connection.remoteAddress;

//     // @todo authenticate request
//     // @todo if authenticated

//     // @todo user can put in a client id
//     //         - system will know it's a client ID
//     //         - send client configurations
//     //
//     //       OR
//     //
//     //       user can put in a User ID
//     //         - system knows its a uid
//     //         - create identity for this machine
//     //         - get this machine's cid or generate one


//     var uid;
//     var cid;

//     // determine if id is uid or cid
//     if (/[a-fA-F0-9]{10}-\d/.test(id)) {
// 	// id is uid
// 	uid = id;



// 	// is this user in the system?
// 	// @todo authenticate
// 	red.GET('user/' + uid + '/number', function(err, num) {
// 	    console.log('user ' + uid +
// 			' number ' + num + ' is in the system');
// 	    // user is in the system
	    




// 	    // does this updater client have a cid?
// 	    //   no because they only sent a uid
	    
// 	    // create an identity for this updater client
// 	    cid = guid();

// 	    // associate this new updater client with the user
// 	    red.SET('client/' + cid + '/owner', uid, function(err, reply) {
// 		if (err) throw err;

// 		red.SADD('user/' + uid + '/clients', uid, function(err, reply) {
// 		    if (err) throw err;

// 		    console.log('New client ' + cid +
// 				' registered to user ' + uid);

// 		    // get client configuration
// 		    red.MGET('client/' + cid + '/config/update-interval',
// 			     //'client/' + cid + '/config/xyz', // insert other config values to be sent to client here
// 			     function(err, config) {
// 				 if (err) throw err;

// 				 console.log('config: ' + config[0]);
// 				 console.log('config: ' + config[1]);

// 				 if (config.updateInterval != null) {
				     
// 				     res.json({
// 					 "cid": cid,  // client updater's new id
// 					 "ip": ip,    // the IP client is updating from
// 					 "updateInterval": config.updateInterval
// 				     });
				     
// 				 } else {
// 				     res.send('hello user ' + uid +
// 					      ' your ip: ' + ip +
// 					      ' your cid: ' + cid
// 					     );
// 				 }			     
// 			 });
		    
// 		    red.GET('client/' + cid + '/config/update-interval', function(err, updateInterval) {
			





		
		
// 		    });
// 		});
// 	    });
// 	});
	    

	

//     } else if (/[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}/.test(id)) {
// 	// id is cid
// 	cid = id;

// 	// @todo authenticate
// 	// @todo return config
	
//     }

    



// });

// api endpoints
require('./api/client')(app);


app.use(express.static(__dirname + '/public'));

console.log('server listening on port ' + nconf.get('port'));
server.listen(nconf.get('port'));