var dns = require('native-dns');
var server = dns.createServer();
var db = require('../middleware/db');
var nconf = require('nconf');


nconf.env(['FQDN'])
    .file({ file: '../config.json' });

var fqdn = nconf.get('FQDN');    // know the zone we respond authoritatively to
var addresses = nconf.get('ADDRESSES'); // the ip addresses of the dwane web cp
var addressCounter = 0;

var domainPattern = new RegExp(fqdn+"?$");
var subdomainPattern = new RegExp("([a-z0-9]+)."+fqdn+"?$");


function roundRobinIP() {
    console.log('roundRobinIP index: ' + addressCounter);
    console.log('typeof addresses: ' + typeof addresses);
    
    if (addressCounter == addresses.length) return addresses[0];
    return addresses[addressCounter++];
}


function directHome(req, res, next) {
    res.answer.push(dns.A({
	name: req.name,
	address: roundRobinIP(),
	ttl: 600
    }));
}

function getAliasIP(alias, next) {

    // look in db for alias with this questioned domain
    db.getAliasMap(alias, function(err, cid) {
	if (err) return next(err, null);
	if (!cid) return next(null, null);
	
	db.getClientLatestIP(cid, function(err, ip) {
	    if (err) return next(err, null);
	    if (!ip) return next(null, null);

	    return next(null, ip);
	});
    });
}

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

    console.log('ANSWERING questions: ');
    console.dir(req.question);
    
    (function answerOne() {
	var questions = req.question.slice(0); // clone question array
	var q = questions.splice(0, 1)[0];  // remove the first question and return it (store in q)

	// make blacklist of subdomains (aliases) not available to users
	//
	// if *dwane.co is entered
	//   no subdomain is entered
	//     redirect to main site
	//
	//   if subdomain in question is in blacklist
	//     redirect to main site with error
	//
	
	//var subdomain = name.match(

	var subdomain;
	var domain;
	var name = q.name;
	// if *dwane.co is entered

	var domainMatch = name.match(domainPattern);
	if (!domainMatch) return next(); // we can't answer this question; it's not meant for dwane.

	var subdomainMatch = name.match(subdomainPattern);
	if (!subdomainMatch) {
	    // subdomain was not entered
	    // redirect user to dwane home page with error
	    res.answer.push(dns.A({
		name: name,  
		address: roundRobinIP(),
		ttl: 600
	    }));

	    return res.send();
	    
	} else {
	    // subdomain was entered
	    
	    var alias;
	    var name = q.name;                            // the zone in question
	    
	    console.log('sub match: ' + subdomainMatch);
	    
	    alias = subdomainMatch[1];
	    console.log('---->  alias found: ' + alias);
	    
	    //var match = name.match(/[^.]+/);              //
	    //console.log('naked match: ' + match);
	    //if (match) alias = match[0];                  // 
	    //console.log('alias: ' + alias + ', ' +
	    //	    'name: ' + name + ', ' +
	    //	    'match: ' + match);

	    getAliasIP(alias, function(err, ip) {
		if (err) return next(err);
		if (!ip) {

		    res.answer.push(dns.A({
			name: name,
			address: roundRobinIP(),
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



		} else {
		    console.log('---> got IP: ' + ip);
		    // got aliases ip

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
		}

		if (questions.length == 0) {
		    console.log("EVERYTHING IS AWESOME");
		    return next(null, res);
		    
		} else {
		    console.log(" >> answer some more!");
		    answerOne();
		}
	    });
	}
    })();
}


		
	
    



server.on('request', function(req, res) {
    console.log('(event) request received');
    //console.dir(req);

    answerQuestions(req, res, function(err, res) {
	if (err) console.log('error answering questions: ' + err);
	
	// console.dir(answers);
	//res.question = req.question;
	//res.answer = answers;
	// console.log('appendin answeers');
	// console.dir(res.answer);
	console.log('SENDING RESPONSE');
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