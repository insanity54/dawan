var redis = require('redis');
var red = redis.createClient(null, null, {"retry_max_delay": "180000"});
var child = require('child_process');


/**
 * getUser
 *
 */
function getUser(uid, callback) {
    red.GET('user/' + uid + '/number', function(err, number) {
	if (err) return callback(err, null);
	callback(null, number);
    });
}

/**
 * getUserClients
 *
 * Get the clients belonging to a user 
 */
function getUserClients(uid, callback) {
    red.SMEMBERS('user/' + uid + '/clients', function(err, clients) {
	if (err) return callback(err, null);
	callback(null, clients);
    });
}

/**
 * getClientOwner
 *
 */
function getClientOwner(cid, callback) {
    red.GET('client/' + cid + '/owner', function(err, owner) {
	if (err) return callback(err, null);
	callback(null, owner);
    });
}
    
/**
 * getClientConfig
 */
function getClientConfig(cid, callback) {
    var config = {};
    
    getClientUpdateInterval(cid, function(err, interval) {
	if (err) return callback(err, null);
	config.updateInterval = interval;
	
	callback(null, config);
    });
}

/**
 * getClientUpdateInterval
 *
 * utility function, not exported
 */
function getClientUpdateInterval(cid, callback) {
    red.GET('client/' + cid + '/config/update-interval', function(err, interval) {
	if (err) return callback(err, null);
	if (interval == null) interval = 60000; // @todo this needs to come from
	                                        //       redis (client/default/config/update-interval)
	                                        //       instead of being hard coded
	callback(null, interval);
    });
}


/**
 * getAliasOwner
 *
 * Finds the owner of a dwane alias (subdomain)
 *
 * @param {string} alias   the alias to find owner of
 * @callback callback      (err, uid)
 */
function getAliasOwner(alias, callback) {
    red.GET('alias/' + alias + '/owner', function(err, owner) {
	if (err) callback(err, null);
	callback(null, owner);
    });
}



/**
 * getAliasMap
 *
 * Gets the client that the specified alias is mapped to
 *
 * @param {String} alias    the alias (subdomain)
 * @callback callback       (err, cid)
 */
function getAliasMap(alias, callback) {
    console.log('db::alias' + alias);
    red.GET('alias/' + alias + '/map', function(err, cid) {
	if (err) callback(err, null);
	callback(null, cid);
    });
}


/**
 * getClientLatestIP
 *
 * Gets the last IP reported by the specified client id number
 *
 * @param {int} cid    the client ID number
 */
function getClientLatestIP(cid, callback) {
    red.LRANGE('client/' + cid + '/ip/recentl', 0, 0, function(err, update) {
	if (err) return callback(err, null);
	if (update == false) return callback(null, undefined);

        // update is an array containing a range of redis elements that
	// matched our query. Since we only got one element, (-1 to -1) we want
	// the first element, a string in the format,
        // "nnn.nnn.nnn.nnn tttttttttttt" where n's are Ip address
        // and ttt is time when the IP address was logged.
	//
        // We only want the IP address in this case,
        // so we get the string (containing ip + time) (array element 0)
        // and split the string at the space, creating another array
        // of the ip [0], and the time [1]. We keep the IP.
	console.log('cid:' + cid)
	console.log('update:' + update[0])
	console.dir(update);
	var ip = update[0].split(" ")[0];
	
	return callback(null, ip);
    });
}

function findOrCreateBasecampUser(bcuid, callback) {
    console.log('db::getBasecampUser');
    red.GET('user/basecamp/' + bcuid + '/uid', function(err, uid) {
	console.log('db::findOrCreateBasecampUser: got uid ' + uid + ' using bcuid: ' + bcuid);
	if (err) return callback(err, null);  // db error
	if (uid) return callback(null, uid);  // got user
	
	// uid for this bcuid is not set, so create user
	createUser(function(err, uid) {
	    console.log('db::findOrCreateBasecampUser: created user with uid: ' + uid);
	    if (err) return callback(err, null);
	    if (!uid) return callback(null, null);
	    
	    red.SET('user/basecamp/' + bcuid + '/uid', uid, function(err, reply) {
		console.log('set basecamp user ' + reply + ' tyvm');
		if (err) return callback(err, null);
		if (!reply) return callback(null, null);
		return callback(null, reply);
	    });	
	});
    });
}


function createUser(callback) {
    console.log('db::createuser');
    
    red.INCR('user/index', function(err, number) {
	if (err) return callback(err, null);
	if (!number) { console.log('db::createuser could not increment user/index'); return callback(null, null) }

	generateUid(function(err, uid) {
	    console.log('db::createUser::generaetUid is done with uid: ' + uid);
	    if (err) return callback(err, null);
	    if (!uid) return callback('could not generate uid', null);

	    red.SET('user/' + uid + '/number', number, function(err, good) {
		console.log('set user/uid/number to: ' + good);
		if (err) return callback(err, null);
		if (!good) return callback(null, null);
		return callback(null, number); //@todo there needs to be a way to refer to a uid using their number
	    });
	});
    });
}


function generateUid(callback) {
    console.log('db:generateUid');
    var bufs = [];
    
    randomHex = child.spawn('openssl', ['rand', '-hex',  '5']);
    randomHex.stdout.on('data', function(data) { bufs.push(data); console.log('db::generateUid: got data: ' + data); });
    randomHex.stdout.on('end', function() {  return callback(null, Buffer.concat(bufs) + '-0') });
    randomHex.stderr.on('data', function(data) { console.log('db::generateUid STANDARD ERROR'); });
    //randomHex.on('close', function(code) { console.log('child process exited with code ' + code); })
}

/**
 * validateUid
 *
 * checks newly generated uid
 * VALID if uid does not already exist in db
 */
function validateUid(uid, callback) {
    red.GET('user/' + uid + '/number', function(err, exists) {
	if (err) return callback(err, null);
	if (exists) return callback(null, false);  // this uid exists already; invalid uid.
	return callback(null, true);               // this uid doesn't exist; valid uid.
    });
}

function getUid(callback) {
    generateUid(function(err, uid) {
	if (err) return callback(err, null);
	if (!uid) return callback('could not generate uid', null);
	
	validateUid(uid, function(err, valid) {
	    if (err) return callback(err, null);
	    if (!valid) return callback('generated uid already exists', null); //ccc @todo recurse until valid uid generated
	});
    });
}

/**
 * setBasecampUser
 *
 * creates new basecamp user
 * (called by getBasecampUser... not exported.)
 */
function setBasecampUser(bcuid, callback) {
    // generate uid   (openssl rand -hex 5) + '-0' => uid
    // create uidn    INCR user/index => SET user/*uid*/number uidn
    //                SET  user/*uid*/clients
    //                

    red.SET('user/basecamp/' + bcuid + '/uid', uid, function(err, good) {
	console.log('set basecamp user ' + good + ' tyvm');
	if (err) return callback(err, null);
	if (!good) return callback(null, null);
	return callback(null, good);
    });
}
    

function setClientLifetimeIP(cid, ip, epoch, callback) {
    red.ZADD('client/' + cid + '/ip/lifetimez',
	     epoch,
	     ip,
	     function(err, reply) {
		 if (err) callback(err);

		 red.ZREMRANGEBYRANK('client/' + cid + '/ip/lifetimez',
				     0, 99,
				     function(err, reply) {
					 if (err) callback(err);
					 callback(null, reply);
				     });
	     });
}

// @todo this should be named, 'setClientLatestIP'... rename all instances in all files
function setClientRecentIP(cid, ip, epoch, callback) {
    red.LPUSH('client/' + cid + '/ip/recentl',
	      ip + ' ' + epoch,
	      function(err, reply) {
		  if (err) callback(err);

		  // keep only last 100 log entries
		  red.LTRIM('client/' + cid + '/ip/recentl',
			    0, 99,
			    function(err, reply) {
				if (err) callback(err);

				callback(null, reply);
			    });
	      });
}

function setClientOwner(cid, uid, callback) {
    red.SET('client/' + cid + '/owner', uid, function(err) {
	if (err) return callback(err);

	red.SADD('user/' + uid + '/clients', cid, function(err, reply) {
	    if (err) return callback(err);
	    callback(null, reply);
	});
    });
}



module.exports = {
    getAliasOwner: getAliasOwner,
    getAliasMap: getAliasMap,
    getClientLatestIP: getClientLatestIP,
    getClientOwner: getClientOwner,
    getClientConfig: getClientConfig,
    getUser: getUser,
    getUserClients: getUserClients,
    findOrCreateBasecampUser: findOrCreateBasecampUser,

    setClientLifetimeIP: setClientLifetimeIP,
    setClientRecentIP: setClientRecentIP,
    setClientOwner: setClientOwner
}