var redis = require('redis');
var red = redis.createClient(null, null, {"retry_max_delay": "180000"});


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
 */
function getAliasMap(alias, callback) {
    red.GET('alias/' + alias + '/client', function(err, cid) {
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
    red.LRANGE('client/' + cid + '/ip/recentl', -1, -1, function(err, update) {
	if (err) callback(err, null);
	if (update == false) return ( callback('getClientLatestIP: update not received', null));

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
	
	callback(null, ip);
    });
}




function setClientLifetimeIP(cid, ip, epoch, callback) {
    red.ZADD('client/' + cid + '/ip/lifetimez',
	     epoch,
	     ip,
	     function(err, reply) {
		 if (err) callback(err);
		 callback(null, reply);
	     });
}

function setClientRecentIP(cid, ip, epoch, callback) {
    red.RPUSH('client/' + cid + '/ip/recentl',
	      ip + ' ' + epoch,
	      function(err, reply) {
		  if (err) callback(err);
		  callback(null, reply);
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

    setClientLifetimeIP: setClientLifetimeIP,
    setClientRecentIP: setClientRecentIP,
    setClientOwner: setClientOwner
}