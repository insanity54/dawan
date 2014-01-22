var _ = require('underscore');
//var client = require('./../client // this includes the grunt(?) built clientside source



function skipMaster(req) {
    // return true if the user's web browser is requesting any of these urls, 
    return _.any(['/api', '/components', '/css', '/js', '/build', '/static', '/favicon.ico' ], function(url) {
        return req.url.substr(0, url.length) === url;
    });
}

function serve(title, js, css) {
    // don't serve the master page to any request that is in the blacklist
    return function (req, res, next) {
	if (skipMaster(req)) {
            console.log('servemaster middleware here. got ' + req.url + ' so skipping serving.');
            return next();
	}
        console.log('servemaster middleware here. got ' + req.url + ' so SERVING!');
	res.render('index.html', { title: title, js: js, css: css });
    };
}

module.exports = serve;
    
    
    