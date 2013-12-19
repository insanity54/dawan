var _ = require('underscore');
//var client = require('./../client



function skipMaster(req) {
    // if the user's web browser is requesting any of these urls, 
    // don't serve the master page to that request.
    return _.any(['/api', '/components', '/css', '/js', '/build'], function(url) {
        console.log('servemaster middleware here. got ' + url + ' so skipping serving.');
        return req.url.substr(0, url.length) === url;
    });
}

function serve(title, tpl, js, css) {
    return function (req, res, next) {
	if (skipMaster(req)) {
            return next();
	}
        console.log('servemaster middleware here. got ' + req.url + ' so SERVING!');
	res.render(tpl, { title: title, js: js, css: css });
    };
}

module.exports = serve;
    
    
    