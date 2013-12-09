//
// ROUTES
//
app.get("/", function(req, res) {
//    console.dir(req.headers.host);
    res.render('index.html', { title: 'Dwane', hostname: req.headers.host });
});

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

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.get("/secret", function(req, res) {
//    res.send(nconf.get('secret') + ' <a href="/logout">log</a>');
});