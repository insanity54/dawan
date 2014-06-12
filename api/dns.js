var dns = require('native-dns');
var server = dns.createTCPServer();
var db = require('../middleware/db');

server.on('request', function(req, res) {
    console.log('request: ' + req);
    console.dir(req);

    var questions = req.question;
    questions.forEach(function(question) {
        // look in db for alias with this questioned domain

        // turn 'grimnok.dwane.co' to 'grimnok'
        var alias;
        var name = question.name;
        var match = name.match(/[^.]+/);
        if (match) alias = match[0];
        console.log('alias: ' + alias + ', ' +
                    'name: ' + name + ', ' +
                    'match: ' + match);
        
        db.getAliasMap(alias, function(err, cid) {
            db.getClientLatestIP(cid, function(err, ip) {

                console.log('got client latest ip: ' + ip);

                res.answer.push(dns.A({
                    name: name,
                    address: ip,
                    ttl: 600,
                }));

                return res.send();                
                
            });
        });
    });
                       
    //     question
        
    // request: [object Object]
    // { header: 
    //   { id: 54548,
    //     qr: 0,
    //     opcode: 0,
    //     aa: 0,
    //     tc: 0,
    //     rd: 1,
    //     ra: 0,
    //     res1: 0,
    //     res2: 0,
    //     res3: 0,
    //     rcode: 0 },
    //   question: [ { name: 'www.google.com', type: 1, class: 1 } ],



    // res.answer.push(dns.A({
    //     name: req.question[0].name,
    //     address: '127.0.0.1',
    //     ttl: 600,
    // }));

    // res.answer.push(dns.A({
    //     name: req.question[0].name,
    //     address: '127.0.0.2',
    //     ttl: 600,
    // }));

    // res.additional.push(dns.A({
    //     name: 'hostA.example.org',
    //     address: '127.0.0.3',
    //     ttl: 600,
    // }));
    
});


server.on('listening', function(req, res) {
    console.log('server listening');
});

server.on('error', function(err, buf, req, res) {
    console.log(err.stack);
});

server.on('socketError', function(err, socket) {
    console.log('socket error: ' + err.stack);
});

server.on('close', function(req, res) {
    console.log('server closed.');
});


server.serve(53);
//server.serve(53533);