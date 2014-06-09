// User/Admin control panel


var cp = function(app) {


    function validateUid(req, res, next) {
	console.log('::validateUid');
    	if (/[a-fA-F0-9]{10}-\d/.test(req.dwane.uid)) {
	    return next();
	}
	res.send('invalid uid: ' + req.dwane.uid, 400);
    }
    

    /**
     * Get a user's alias and redirect to network
     * of their updater client
     */
    app.get('/', function(req, res) {
	app.render('index.html');
    });
	    
module.exports = cp;