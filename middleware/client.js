// Handler of Dwane updater client interactios
//   i.e. The Dwane.co google chrome extension


var db = require('./db.js');


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
//     - GET /alias/<alias>/map => cid
//   - needs to know the latest IP of that client
//     - LRANGE /client/<cid>/ip/recentl -1 -1
//


var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
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
    //console.dir(req.headers);
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('  req IP:' + ip);
    if (ip) {
	if (!req.dwane) req.dwane = {};
	req.dwane.ip = ip;
	return next();
    }
    res.send('couldn\'t get IP from client');
}

function getClientLatestIP(req, res, next) {
    console.log('api::client::getClientLatestIP');
    db.getClientLatestIP(req.dwane.cid, function(err, ip) {
	if (err) res.send('could not get client\'s latest IP: ' + err);
	if (typeof ip != 'undefined') { req.dwane.ip = ip; return next(); }
	res.send('updater client has not sent the server an IP update');
    });
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
	//console.log('owner of cid ' + cid + ' is: ' + owner + ' and reqUid is: ' + uid);
	if (err) return res.send('database error 2384');
	if (!owner) return res.end('no owner of cid ' + cid);
	if (owner == uid) return next();
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

    console.log(  'logging client ' + cid + ' ip');

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
	if (!reply) res.send('could not set client ' + cid + ' owner ' + uid);
	next();
    });
}


module.exports = {
    getReqCid: getReqCid,
    getReqIP: getReqIP,
    getClientLatestIP: getClientLatestIP,
    validateCid: validateCid,
    verifyClientOwner: verifyClientOwner,
    logClientIP: logClientIP,
    sendClientConfig: sendClientConfig,
    generateCid: generateCid,
    registerCid: registerCid
};