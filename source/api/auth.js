var middleware = require('./../middleware');

var auth = function(app) {

    // app.get("/", function(req, res) {
    // 	//    console.dir(req.headers.host);
    // 	res.render('index.html', { title: 'Dwane', hostname: req.headers.host });
    // });

    // app.get('/test', function(req, res) {
    //     var body = '';
    //     if (req.session.poops) {
    //         console.dir(req.session);
    // 	++req.session.poops;
    //     } else {
    //         req.session.poops = 1;
    //         body += '<p>First time pooping? view this page in several browsers D: </p>';
    //     }
    //     res.send(body + '<p>pooped <strong>' + req.session.poops + '</strong> times.</p>');
    // });



    // // when user wants to sign in using twitter
    // app.post('/api/auth/signup',
    //          passport.authenticate('twitter', { successRedirect: '/success',
    //                                             failureRedirect: '/fail' })(req, res));

    


    // when client wants to signin using twitter
    // @todo this needs a custom callback to make use of SPA (instead of the passport default page redirection)
    app.get('/api/auth/twitter', passport.authenticate('twitter', { successRedirect: '/success', faulureRedirect: '/fail' })(req, res));

    // when twitter replies with pass/fail login info
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));


    app.get("/secret", function(req, res) {
	//    res.send(nconf.get('secret') + ' <a href="/logout">log</a>');
    });
};

module.exports = auth;