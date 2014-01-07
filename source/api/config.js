var redis = require('redis');
var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});


var wans = function(app) {
    var container = [{
        title: 'WANNY1',
        jenk: 'ima jenker',
        completed: false
    }, {
        title: 'WANNY2',
        jenk: 'ima jenker',
        completed: false
    }, {
        title: 'WANNY3',
        jenk: 'ima jenker',
        completed: false
    }, {
        title: 'WANNY4',
        jenk: 'ima jenker',
        completed: false
    }];


    /**
     *  getWans
     *
     *  Retrieves the user's configured WAN ports from the database.
     */
    function getWans() {
        // - authenticate
        // - return WAN info from redis
    }
    

    // user is retrieving wan list from db
    app.get('/api/user/config/wans', function(req, res) {
        console.log('user retrieving wan list from db: ' + console.dir(container));
        res.json(container);
    });


    // user is adding wan to db
    app.post('/api/user/config/wans', function(req, res) {
        var wan = req.body;
        container.push(wan);

        res.send(201);
    });

    // user is updating their wan-associated domain
    app.post('/api/user/config/domain', function(req, res) {
        var domain = req.body;
        console.log('incoming post with domain:');
        console.dir(domain);
        res.send(201);
    });
};



module.exports = wans;