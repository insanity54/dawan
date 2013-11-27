
// INCLUDES
var express = require('express');
var http = require('http');
var util = require('util');  // @todo delete me before deploy

var app = express();
var server = http.createServer(app);

var port = config.port;



// FAKE DATABASE
//
// account_types:
//   0: free
//   1: premium
//
// idea: users have a 'version' configuration, where they can choose the version of dawan that they use
//
// 'wans' is the number of WAN ports the user has on their router
// 'update_time' is an array of time in milliseconds that the user's client will contact the master server.
//     Each array element is for the user's different WANs. ie each WAN has it's own update interval.
var users = [
    { "account": { "name": "george henry", "password": "taco", "type": 1 }, "config": { "wans": "1", "update_time": [ 3000, 6000 ] } } 
]


app.set('views', __dirname + '/tpl');
app.set('view engine', "nunjucks");



//
// ROUTES
//
app.get("/", function(req, res) {

    res.send('hello thank you for visiting');
});

app.get("/secret", function(req, res) {
    res.send('BM-2D8cnu1e9vCEH36E65WbqZiqZZvg1XXPit');
});

app.use(express.static(__dirname + '/public'));

