// test route. @todo delete me

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


    // user is retrieving wan list from db
    app.get('/api/wans', function(req, res) {
        res.json(container);
    });


    // user is adding wan to db
    app.post('/api/wans', function(req, res) {
        var wan = req.body;
        container.push(wan);

        res.send(201);
    });
};

module.exports = wans;