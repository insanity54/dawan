0// Handler of Dwane updater client interactios
//   i.e. The Dwane.co google chrome extension

var db = require('../middleware/db.js');
var u = require('../middleware/user.js');
var c = require('../middleware/client.js');


var client = function(app) {

    // console.log('getReqUid ' + u.getReqUid);
    // console.log('getReqCid' + c.getReqCid);
    // console.log('getReqIP' + c.getReqIP);
    // console.log('validateUid' + c.validateUid);
    // console.log('validateCid' + c.validateCid);
    // console.log('verifyClientOwner' + c.verifyClientOwner);
    // console.log('validateUser ' + u.validateUser);
    // console.log('logClientIP ' + c.logClientIP);
    // console.log('sendClientConfig ' + c.sendClientConfig);    

    console.log(u.getReqUid);
    console.log(c.getReqCid);
    console.log(c.getReqIP);
    console.log(u.validateUid);
    console.log(c.validateCid);
    console.log(c.verifyClientOwner);
    console.log(u.validateUid);
    console.log(c.logClientIP);
    console.log(c.sendClientConfig);    

    
    /**
     * Updater client is sending us an update
     *   - does this as ofen as configured by updateInterval
     *   - sever validates request
     *   - server logs client's IP address
     *   - server replies with client configuration
     */
    app.get("/api/config/:uid/:cid",
	    u.getReqUid,
	    c.getReqCid,
	    c.getReqIP,
	    u.validateUid,
	    c.validateCid,
	    c.verifyClientOwner,
	    u.validateUid,
	    c.logClientIP,
	    c.sendClientConfig
	   );

	    
    /**
     * Updater client is registering
     *   - does this on first run.
     *   - sends server a user ID
     *   - server generates and sends client a client ID
     */
    app.get("/api/config/:uid",
	    u.getReqUid,
	    c.getReqIP,
	    u.validateUid,
	    c.generateCid,
	    c.registerCid,
	    c.sendClientConfig
	   );
	    
	    
    // /**
    //  * User is loading their client mappings in their control panel
    //  *
    //  */
    // app.get("/api/client/:uid",
    // 	    authenticateReq,	    
    // 	    getReqUid,
    // 	    validateUid,

}

module.exports = client;