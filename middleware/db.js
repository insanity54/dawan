var redis = require('redis');
var red = redis.createClient(null, null, {"retry_max_delay": "180000"});


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
    red.GET('/alias/' + alias + '/client', function(err, cid) {
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
    red.LRANGE('/client/' + cid + '/ip/recentl', -1, -1, function(err, update) {
	if (err) callback(err, null);

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
	console.log('update:' + update)
	var ip = update[0].split(" ")[0];
	
	callback(null, ip);
    });
}




module.exports = {
    getAliasOwner: getAliasOwner,
    getAliasMap: getAliasMap,
    getClientLatestIP: getClientLatestIP
}