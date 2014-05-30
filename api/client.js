var db = require('../middleware/db.js');


var client = function(app) {
    


    /**
     * guid
     *
     * generate a random guid
     */
    var guid = (function() {
	function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return function() {
	    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	};
    })();

    


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

    // SET user/uid/account/name 'george henry'
    // SET user/uid/account/email george@example.com
    // SET user/uid/account/password rosebud
    // SET user/uid/account/type 1
    // SET user/uid/config/wans 1
    // SET user/uid/config/update.time '3000 6000'




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



	
	// 1) get requested alias from params
	// 2) get client IP that alias points to
	// 3) redirect requester to IP address of client IP
	// use owner to find home ip
	// redirect visitor to home ip
	
	// user owns alias
        // user owns client
        // client has IP
        // 
        // User GUI
        //   - needs to know aliases user owns
        //   - needs to know client ids user owns
        //   - needs to know IP of client
        // 
        // Server App
	//   - needs to know alias owner
	//     - GET /alias/<alias>/owner  => uid

        // Anon user connecting to alias
        //   - needs to know what client the alias is mapped to
	//     - GET /alias/<alias>/client => cid
        //   - needs to know the latest IP of that client
	//     - LRANGE /client/<cid>/ip/recentl -1 -1
        //


    var toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }



    function getAliasOwner(req, res, next) {
	console.log('::getAliasOwner');
	var alias = req.params.alias;

	db.getAliasOwner(alias, function(err, owner) {
	    if (err) next(err);
	    if (owner) { req.dwane.owner = owner; next(); }
	    res.send('no owner of specified alias');
	});
    }

    function getAliasMap(req, res, next) {
	console.log('::getAliasMap');
	db.getAliasMap(req.dwane.alias, function(err, cid) {
	    if (err) res.send('problem with database getting alias map');
	    console.log('alias map: ' + cid);
	    if (cid) { req.dwane.cid = cid; return next(); }
	    res.send('could not get map of specified alias');
	});
    }
	    
    function getReqAlias(req, res, next) {
	console.log('::getReqAlias');
	var alias = req.params.alias;
	if (alias) {
	    if (!req.dwane) req.dwane = {};
	    req.dwane.alias = alias;
	    return next();
	}
	res.send('didn\'t receive Alias in request');
    }


    function getReqUid(req, res, next) {
	console.log('::getReqUid');
	var uid = req.params.uid;
	if (uid) {
	    if (!req.dwane) req.dwane = {};
	    req.dwane.uid = uid;
	    return next();
	}
	res.send('didn\'t receive UID in request');
    }

    function getReqCid(req, res, next) {
	console.log('::getReqCid');
	var cid = req.params.cid;
	if (cid) {
	    if (!req.dwane) req.dwane = {};
	    req.dwane.cid = cid;
	    return next();
	}
	res.send('didn\'t receive CID in request');
    }

    function getReqIP(req, res, next) {
	console.log('::getReqIP');
	if (!req.dwane) req.dwane = {};
	var ip = req.connection.remoteAddress;
	if (ip) {
	    if (!req.dwane) req.dwane = {};
	    req.dwane.ip = ip;
	    return next();
	}
	res.send('couldn\'t get IP from client');
    }
    
    function getClientLatestIP(req, res, next) {
	console.log('::getClientLatestIP');
	db.getClientLatestIP(req.dwane.cid, function(err, ip) {
	    if (err) res.send('could not get client\'s latest IP');
	    if (ip) { req.dwane.ip = ip; next(); }
	});
    }

    function redirectVisitor(req, res) {
	console.log('::redirectVisitor');
	res.redirect('http://' + req.dwane.ip);
    }

    function validateUid(req, res, next) {
	console.log('::validateUid');
    	if (/[a-fA-F0-9]{10}-\d/.test(req.dwane.uid)) {
	    return next();
	}
	res.send('invalid uid');
    }
    
    function validateCid(req, res, next) {
	console.log('::validateCid');
	if (/[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}/.test(req.dwane.cid)) {
	    return next();
	}
	res.send('invalid cid');
    }


    function verifyClientOwner(req, res, next) {
	console.log('::verifyClientowner');
	// get cid
	// get uid
	// id cid owner uid?

	var cid = req.dwane.cid;
	var uid = req.dwane.uid;

	db.getClientOwner(cid, function(err, owner) {
	    if (err) res.send('database error 2384');
	    if (owner == uid) next();
	});
    }

    function validateUser(req, res, next) {
	console.log('::validateuser');
	// @todo some authentication here would be nice

	var uid = req.dwane.uid;

	db.getUser(uid, function(err, number) {
	    if (err) res.send('database error 2385');
	    if (number) next();
	});
    }

    function logClientIP(req, res, next) {
	console.log('::logClientIP');
	var ip = req.dwane.ip;
	var cid = req.dwane.cid;
	if (!ip) res.send('could not retrieve IP from buffer', 500);
	if (!cid) res.send('could not retrieve client ID from buffer', 500);

	var counter = 0;
        var epoch = (new Date).getTime();

	db.setClientLifetimeIP(cid, ip, epoch, function(err, success) {
	    if (err) res.send('database error 2386');

	    db.setClientRecentIP(cid, ip, epoch, function(err, success) {
		if (err) res.send('database error 2387');
		next();
	    });
	});
    }

    function sendClientConfig(req, res) {
	console.log('::sendClientConfig');
	var ip = req.dwane.ip;
	var cid = req.dwane.cid;

	if (!ip) res.send('could not retrieve IP from buffer', 500);
	if (!cid) res.send('could not retrieve cid from buffer', 500);

	// get client config from db
	// get client ip from request buffer
	// send config

	// config = {
	//     "cid": cid,
	//     "ip": ip,
	//     "updateInterval": interval
	// };

	db.getClientConfig(cid, function(err, config) {
	    if (err) res.send('database error 2388');

	    config.cid = cid;
	    config.ip = ip;
	    res.json(config);
	});
    }

    function generateCid(req, res, next) {
	console.log('::generateCid');
	var uid = req.dwane.uid;
	var cid = guid();

	req.dwane.cid = cid;
	next();
    }

    function registerCid(req, res, next) {
	console.log('::registerCid');
	var cid = req.dwane.cid;
	var uid = req.dwane.uid;
	if (!cid) res.send('could not retrieve CID from buffer', 500);	
	if (!uid) res.send('could not retrieve UID from buffer', 500);

	db.setClientOwner(cid, uid, function(err, reply) {
	    if (err) res.send('database error 2389');
	    next();
	});
    }




    /**
     * Get a user's alias and redirect to network
     * of their updater client
     */
    app.get("/api/alias/:alias",
	    getReqAlias,
	    getAliasMap,
	    getClientLatestIP,
	    redirectVisitor
	   );
	    

    /**
     * Updater client is sending us an update
     *   - does this as ofen as configured by updateInterval
     *   - sever validates request
     *   - server logs client's IP address
     *   - server replies with client configuration
     */
    app.get("/api/config/:uid/:cid",
	    getReqUid,
	    getReqCid,
	    getReqIP,
	    validateUid,
	    validateCid,
	    verifyClientOwner,
	    validateUser,
	    logClientIP,
	    sendClientConfig
	   );
	    
	    
    
    /**
     * Updater client is registering
     *   - does this on first run.
     *   - sends server a user ID
     *   - server generates and sends client a client ID
     */
    app.get("/api/config/:uid",
	    getReqUid,
	    getReqIP,
	    validateUid,
	    generateCid,
	    registerCid,
	    sendClientConfig
	   );
	    
	    

	    
	    
	    // 1) validate uid & cid
	    // 2) register cid if new // @todo implement
	    // 2) make sure requested cid belongs to requested uid
	    // 3) if user exists in system, store reported ip with time & date
	    // 4) send client's config to requesting client
	    
	    

    // 	    function(req, res) {
    // 	var uid = req.params.uid;
    // 	var cid = req.params.cid;
    // 	var ip = req.connection.remoteAddress;



    // 		// unregistered cid?
    // 		red.GET('client/' + cid + '/owner', function(err, uid) {
    // 		    if (err) throw err;
		    
    // 		    console.log("cid retrieved: " + cid);
    // 		    console.log("user IP: " + ip);
    // 		    console.log('user: ' + uid);

    // 		    if (uid == 'nil' || uid == null) {
    // 		        // client is unregistered
    // 			console.log('client ' + cid + ' is unregistered');

    // 		        // @todo create a temporary account for the unreg user
    // 			res.send('unregistered user ID!');

    // 		    } else {
    // 		        // user exists in system
    // 		        // store user's reported IP along with the time & date
    // 			var epoch = (new Date).getTime();

    // 		        // lifetime history of IPs this client has reported
    // 			red.ZADD('user/' + uid + '/ip/lifetimez', epoch, ip, function(err, reply) {
    // 			    if (err) throw err;
    // 			    console.log('added user ' + uid +
    // 				        '\'s ip ' + ip +
    // 					' from client id ' + cid);

    // 			    // recent history of IPs this client has reported
    // 			    red.RPUSH('user/' + uid + '/ip/recents', ip + ' ' + epoch, function(err, reply) {
    // 				if (err) throw err;
    // 				console.log('recent history added');

    // 			        //   @todo send user's config to requesting client
    // 				red.GET('client/' + cid + '/config/update-interval', function(err, u) {

    // 				    if (err) throw err;
    // 				    if (u != null) {
    // 					// we have the update interval    
    // 					res.json({
    // 					    "cid": cid,
    // 					    "ip": ip,
    // 					    "updateInterval": u
    // 					});

    // 				    } else {
    // 				        // update interval is not configured
    // 					res.send('Hello, ' + cid + '. We logged your IP ' + ip);
    // 				    }
    // 				});
    // 			    });
    // 			});
    // 		    }
    // 		});
    // 	    }
    // 	}
    // });
    


    
    


    
    
    


    // /**
    //  * A new updater client wants to register with the system
    //  */
    // app.get("/api/config/:id", function(req, res) {
    // 	var id = req.params.id;
    // 	var ip = req.connection.remoteAddress;

    // 	// @todo authenticate request
    // 	// @todo if authenticated

    // 	// @todo user can put in a client id
    // 	//         - system will know it's a client ID
    // 	//         - send client configurations
    // 	//
    // 	//       OR
    // 	//
    // 	//       user can put in a User ID
    // 	//         - system knows its a uid
    // 	//         - create identity for this machine
    // 	//         - get this machine's cid or generate one


    // 	var uid;
    // 	var cid;

    // 	// determine if id is uid or cid
    // 	if (/[a-fA-F0-9]{10}-\d/.test(id)) {
    // 	    // id is uid
    // 	    uid = id;



    // 	    // is this user in the system?
    // 	    // @todo authenticate
	    
	    
	    
    // 	    red.GET('user/' + uid + '/number', function(err, num) {
    // 		console.log('user ' + uid +
    // 			    ' number ' + num + ' is in the system');
    // 		// user is in the system
		




    // 		// does this updater client have a cid?
    // 		//   no because they only sent a uid
		
    // 		// create an identity for this updater client
    // 		cid = guid();

    // 		// associate this new updater client with the user
    // 		db.SET('client/' + cid + '/owner', uid, function(err, reply) {
    // 		    if (err) throw err;

    // 		    db.SADD('user/' + uid + '/clients', uid, function(err, reply) {
    // 			if (err) throw err;

    // 			console.log('New client ' + cid +
    // 				    ' registered to user ' + uid);

    // 			// get client configuration
    // 			db.MGET('client/' + cid + '/config/update-interval',
    // 				 //'client/' + cid + '/config/xyz', // insert other config values to be sent to client here
    // 				 function(err, config) {
    // 				     if (err) throw err;

    // 				     console.log('config: ' + config[0]);
    // 				     console.log('config: ' + config[1]);

    // 				     if (config.updateInterval != null) {
					 
    // 					 res.json({
    // 					     "cid": cid,  // client updater's new id
    // 					     "ip": ip,    // the IP client is updating from
    // 					     "updateInterval": config.updateInterval
    // 					 });
					 
    // 				     } else {
    // 					 res.send('hello user ' + uid +
    // 						  ' your ip: ' + ip +
    // 						  ' your cid: ' + cid
    // 						 );
    // 				     }			     
    // 				 });
			
    // 			db.GET('client/' + cid + '/config/update-interval', function(err, updateInterval) {
			    

    // 			});
    // 		    });
    // 		});
    // 	    });
	    

    // 	} else if (/[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}/.test(id)) {
    // 	    // id is cid
    // 	    cid = id;

    // 	    // @todo authenticate
    // 	    // @todo return config
	    
    // 	}
    // });
}


module.exports = client;