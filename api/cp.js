// User/Admin control panel

var db = require('../middleware/db');
var u = require('../middleware/user');
var c = require('../middleware/client');
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
	console.log('::getReqUser with req.user: ' + req.user + ' and req.user.uid: ' + req.user.uid);
	if (req.isAuthenticated) {
	    console.log('[++] user is authentted: ');

	} else {
	    console.log('[--] user is not auth');
	}
	
	var user = req.user;
	if (!user) return res.send('didn\'t receive user in request');
	if (!req.dwane) req.dwane = {};
	req.dwane.user = user;
	return next();
    }
	
    function getUserClients(req, res, next) {
	console.log('::getUserClients');

	
	
	
	if (typeof req.dwane == 'undefined') return res.send('req.dwane is undefined', 500);
	if (typeof req.dwane.user == 'undefined') return res.send('req.dwane.user is undefined', 500);

	console.log('req.dwane.user is: ' + req.dwane.user);
	
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
	console.log('req.user: ' + req.user);
	res.render('index.html', { 'clients': req.dwane.clients,
				   'uid': req.user.uid
				 });
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


    /**
     * User is loading their client mappings in their control panel
     * Angular calls this. returns configuration json which includes:
     *
     * - Updater client configs
     * - User's claimed dwane domains
     * - User's mappings for dwane domain <-> updater client
     */
    app.get("/api/cp/:uid",
            //u.authenticate,
            u.getReqUid,
            u.validateUid
	    //u.sendMappings
	   );

    
}
	    
module.exports = cp;