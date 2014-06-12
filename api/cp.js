// User/Admin control panel

var db = require('../middleware/db');
var passport = require('passport');




var cp = function(app) {


    function validateUid(req, res, next) {
	console.log('::validateUid');
    	if (/[a-fA-F0-9]{10}-\d/.test(req.dwane.uid)) {
	    return next();
	}
	res.send('invalid uid: ' + req.dwane.uid, 400);
    }

    function authenticate(req, res, next) {
	console.log('::authenticate');
	if (req.isAuthenticated) return next();
	return res.send('ERROR: Not authenticatd', 401);
    }

    function getReqUser(req, res, next) {
	console.log('::getReqUser');
	if (req.isAuthenticated) {
	    console.log('[++] user is authentted: ' + req.isAuthenticated);
	} else {
	    console.log('[--] user is not auth');
	}
	var user = req.params.user;
	if (!user) return res.send('didn\'t receive user in request');
	if (!req.dwane) req.dwane = {};
	req.dwane.user = user;
	return next();
    }
	
    function getUserClients(req, res, next) {
	console.log('::getUserClients');
	if (typeof req.dwane == 'undefined') return res.send('req.dwane is undefined', 500);
	if (typeof req.dwane.user == 'undefined') return res.send('req.dwane.user is undefined', 500);
	
	var user = req.dwane.user;
	if (!user) res.send('could not retrieve user from buffer', 500);

	db.getUserClients(user, function(err, clients) {
	    if (err) return res.send('db error retrieving clients: ' + err);
	    if (!clients) return res.send('User has no registered update clients');
	    req.dwane.clients = clients;
	    return next();
	});
    }

    function renderCP(req, res) {
	console.log('::renderCP');
	res.render('index.html');
    }

    /**
     * Get a user's alias and redirect to network
     * of their updater client
     */
    //app.get('


    /**
     * Home page, introduction and registration
     */
    app.get('/',
	    renderCP
    );

    /**
     * Control panel
     */
    app.get('/cp',
	    authenticate,
	    getReqUser,
	    getUserClients,
	    renderCP
	   );
    
}
	    
module.exports = cp;