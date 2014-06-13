var dns = require('native-dns');
//var server = dns.createTCPServer();
var server = dns.createServer();
var db = require('../middleware/db');



/**
 * answerQuestions
 *
 * Goes through each asked question one by one
 * for each question, it's *.dwane.co alias is found,
 * and the database is queried for the alias.
 *
 * @param {Array} questions     an array of dns question objects.
 *                              ex: { name: derp.dwane.co, type: 1, class: 1 }
 * @callback next               called when all questions are answered. (err)
 *                              (answer is an array of dns answer objects)
 */
function answerQuestions(req, res, next) {
    (function answerOne() {
	var questions = req.question.slice(0); // clone question array
	var q = questions.splice(0, 1)[0];  // remove the first question and return it (store in q)

	var alias;
	var name = q.name;
	var match = name.match(/[^.]+/);
	if (match) alias = match[0];
	console.log('alias: ' + alias + ', ' +
		    'name: ' + name + ', ' +
		    'match: ' + match);

        // look in db for alias with this questioned domain
	db.getAliasMap(alias, function(err, cid) {
	    if (err) return next();
	    if (!cid) return next('couldn\'t get alias map');
	    
	    db.getClientLatestIP(cid, function(err, ip) {
		if (err) return next(err);
		if (!ip) return next('couldn\'t get latest ip');
		
		console.log('client latest IP: ' + ip);

                res.answer.push(dns.A({
                    name: name,
                    address: ip,
                    ttl: 600
                }));

		res.authority.push(dns.SOA({
		    name: name,
		    ttl: 600,
		    primary: 'ns1.dwane.co.',   // @todo don't hard code these
		    admin: 'chris.grimtech.net.',
		    serial: 1,
		    refresh: 21600,
		    retry: 1800,
		    expiration: 1209600,
		    minimum: 432000
		}));

		
		if (questions.length == 0) {
		    console.log("EVERYTHING IS AWESOME");
		    return next();
		    
		} else {
		    console.log(" >> answer some more!");
		    answerOne();
		}
	    });
	});
    })();
}

		
	
    



server.on('request', function(req, res) {
    console.log('request: ' + req);
    console.dir(req);

    console.log('for each question:');
    console.dir(req.question);
    
    answerQuestions(req, res, function(err) {
	if (err) console.log('error answering questions: ' + err);
	// console.dir(answers);

	//res.question = req.question;
	//res.answer = answers;
	// console.log('appendin answeers');
	// console.dir(res.answer);
	console.log('SENDING RESPONSE:');
	console.dir(res);

	return res.send();
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