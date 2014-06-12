var dns = require('native-dns');
var server = dns.createTCPServer();

server.on('request', function(req, res) {
    console.log('request: ' + req);
    console.dir(req);

    res.answer.push(dns.A({
        name: req.question[0].name,
        address: '127.0.0.1',
        ttl: 600,
    }));

    res.answer.push(dns.A({
        name: req.question[0].name,
        address: '127.0.0.2',
        ttl: 600,
    }));

    res.additional.push(dns.A({
        name: 'hostA.example.org',
        address: '127.0.0.3',
        ttl: 600,
    }));
    
    res.send();
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