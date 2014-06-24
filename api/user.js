var u = require('../middleware/user');
var c = require('../middleware/client');


var user = function(app) {

    app.get('/api/user/:uid',
	    u.getReqUid,
	    u.sendConfig // @todo authentication needed first
	   //  u.authenticate,   // find who the requesting user is & see if they're logged in
	   //  u.getReqUid,
	   //  u.validateUid
	   );
}


module.exports = user;