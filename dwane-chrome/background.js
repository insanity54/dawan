var brain;
var bucket;
var controlWindow;
var continueUpdate = true;

/**
 * Create control panel window when app is started
 */
chrome.app.runtime.onLaunched.addListener(function() {
	if (controlWindow && !controlWindow.contentWindow.closed) {
		controlWindow.focus();
	} else {

	    bucket = new Bucket();
	    chrome.app.window.create('control.html', {
		id: "controlpanel",
		bounds: {
		    width: 500,
		    height: 309,
		    left: 0
		},
		frame: 'chrome',
	    },
            function(w) {
	        commandWindow = w;
	    });

	}
});


// event logger                          
var log = (function(){
    var logLines = [];
    var logListener = null;

    var output=function(str) {
	if (str.length>0 && str.charAt(str.length-1)!='\n') {
      str+='\n'
	}
	logLines.push(str);
	if (logListener) {
	    logListener(str);
	}
    };

    var addListener=function(listener) {
	logListener=listener;
    // let's call the new listener with all the old log lines                   
	for (var i=0; i<logLines.length; i++) {
	    logListener(logLines[i]);
	}
    };

    return {output: output, addListener: addListener};
})();


function startBrain(id) {
    continueUpdate = true;
    
    // if local client ID does not exist, get one from the server
    console.log('Background::startBrain: lets see if cid exists');
    log.output('Background::startBrain: id submitted: ' + id);
//    cidExists(function(err, exists) {
//	if (err) log.output(err);

    if (id) {
	brain = new Brain();
	
	bucket.getKey('cid', function(err, cid) {
	    if (err) return log.output('startBrain err: ' + err);
	    if (typeof cid != 'undefined') {
		log.output('cid exists in bucket');
		
		bucket.getKey('updateInterval', function(err, interval) {
		    if (err) return log.output('startBrain err: ' + err);
		    log.output('get update interval ');
		    // use configured update interval and start update loop
		    if (err) throw err;
		    if (interval) {
			log.output('HERE WE GO, interval: ' + interval);
			return updateLoop(interval);
			
		    } else {
			// use default update interval
			bucket.getDefault('updateInterval', function(err, interval) {
			    log.output('get DEFAULT update interval ');
			    if (err) throw err;
			    log.output('HERE WE GO, interval: ' + interval);
			    return updateLoop(interval);
			});
		    }
		});
		
		
	    } else {
		// cid == undefined
		log.output('cid is not in bucket. registering using uid: ' + id);
		
		brain.register(id, function(err, conf) {
		    if (err) return log.output('error registering: ' + err);
		    log.output('Register attempt. rceived: ' + JSON.stringify(conf));
		    log.output('registered. received cid: ' + conf.cid);
		    
		    // add uid to conf
		    // omg this is some of the worst code I've ever written
		    conf.uid = id;
		    
		    // save config sent by sever
		    bucket.setConfig(conf, function(err, conf) {
			if (err) return log.output('error setting config: ' + err);
			log.output('set config in bucket');
			
			// echo config
			log.output('echoing saved config: ' + JSON.stringify(conf));
			log.output('HERE WE GO, interval: ' + conf.updateInterval);
			return updateLoop(conf.updateInterval);
		    });
		});
	    }
	});
		     


    } else {
	// no id was supplied
	log.output('you did not supply a user ID');
    }
}




	    // if id
	    //   brain(id)
	    //
	    //   if cid
	    //     if updateInterval
	    //       return updateLoop(updateInterval)
	    //     else
	    //       return updateLoop(bucket.config.default.updateLoop)
	    //     endif
	    //
            //   else
	    //     register
	    //   endif
	    //
	    //
	    // else
	    //   you didnt give an id
	    // endif
	    //
	    // 


				
    // 			if (id) {
    // 			    // user ID was supplied
			    
    // 			    if (brain) {
    // 				//brain.stop();
    // 				log.output('brain is already runnng');
    // 			    }
			    
    // 			    // create object to communicate with brain
    // 			    brain = new Brain(id);
    // 			    log.output('Starting communications');
			    
    // 			    // getConfig also updates IP address on server
    // 			    brain.getConfig(id, cid, onGotConfig);
			    
    // 			} else {
    // 			    // user ID was not supplied
    // 			    log.output('No user ID entered. Please enter a user ID');

 
    // 	// if we don't have a client ID we register with the server
    // 	log.output('test');
    // 	if (!exists) {

	    

		    
		    
		    
		    
		    
		    
    // 		    generateCid(function(err, cid) {
    // 			if (err) log.output(err);
    // 			log.output('here is your unique cid: ' + cid)
			
    // 			chrome.storage.local.get(null, function(items) {	    
    // 			    console.log('here is local config: ' + items);
    // 			    console.dir(items);
    // 			});
			
			

    // 			}
    // 		    });
    // 		});
    // 	    });
    // 	} else {
    // 	    // cid exists
    // 	    console.log('cid exists');
    // 	    log.output('cid exists');
    // 	}
    // });
		       

	    


function stopBrain() {
    continueUpdate = false;
    log.output('Stopped.');
}

/**
 * onGotConfig
 *
 * What to do after we received the client configuration data from the server (brain)
 */ 
function onGotConfig(conf) {
    // get update-interval value and set this client's interval to that value
    console.dir(conf);
    conf = JSON.parse(conf);
    log.output('update interval rec\'d from server: ' + conf.updateInterval);

    // save the config in the bucket
    bucket.setConfig(conf, function(err, success) {
	if (err) log.output(err);

	bucket.setKey('updateInterval', function(err, interval) {
	    if (err) log.output(err);
	    console.log('HERE WE GO UPDATE LOOP WITH INTERVAL ' + interval);
	    updateLoop(interval);
	});
    });
}


function updateLoop(interval, lastUpdate) {
    // if lastUpdate is undefined, lastUpdate is made to be 0
    //lastUpdate = typeof lastUpdate !== 'undefined' ? lastUpdate : 0;

    setTimeout(function() {
	console.log('update loop every ' + interval + ' ms ' +
		    'with last update at ' + lastUpdate);

	if (continueUpdate == true) {
	    // Update server with client's IP address
	    bucket.getConfig(function(err, conf) {
		if (err) log.output(err);
		
		brain.update(conf.uid, conf.cid, function(err, reply) {
		    if (err) {
			console.log('error: ' + err);
			
		    } else {
			if (reply === '400') {
			    console.log('Error: ' + reply);
			    
			    
			} else if (reply === '200') {
			    console.log('Good: ' + reply);
			    
			}
		    }
		});
	    });
	    
	    // keep looping
	    updateLoop(interval, lastUpdate);
	}
    }, interval);
}


// function cidExists(callback) {
    
//     console.log('clog: cidExists func');
//     log.output('logo: cidExists func');

//     bucket.getKey('cid', function(err, cid) {
// 	if (err) log.output(err);
// 	if (cid) return callback(null, true);
// 	callback(null, false);
// 	console.log('cidexists exit');
// 	log.output('cidexists exit');
//     });
// }
		 
