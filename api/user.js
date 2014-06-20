var u = require('../middleware/user.js');


var user = function(app) {

    app.get('/api/user/:uid', function(req, res) {
	res.send('hello user ' + req.params.uid); });
	   //  u.authenticate,   // find who the requesting user is & see if they're logged in
	   //  u.getReqUid,
	   //  u.validateUid
	   // );
}


module.exports = user;