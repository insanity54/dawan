var brain;
var controlWindow;
var continueUpdate = true;

/**
 * Create control panel window when app is started
 */
chrome.app.runtime.onLaunched.addListener(function() {
	if (controlWindow && !controlWindow.contentWindow.closed) {
		controlWindow.focus();
	} else {

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
    
    if (id) {
	// user ID was supplied
	
	if (brain) {
            //brain.stop();
	    log.output('brain is already runnng');
	}

	// create object to communicate with brain
	brain = new Brain(id);
	log.output('Starting communications');
	
	// getConfig also updates IP address on server
	brain.getConfig(id, onGotConfig);
	
    } else {
	// user ID was not supplied
	log.output('No user ID entered. Please enter a user ID');
    }
}

function stopBrain() {
    continueUpdate = false;
    log.output('Stopped.');
}

function onGotConfig(conf) {
    // get update-interval value and set this client's interval to that value
    console.dir(conf);
    conf = JSON.parse(conf);
    log.output('update interval rec\'d from server: ' + conf.updateInterval);

    updateLoop(conf.updateInterval);
}


function updateLoop(interval, lastUpdate) {
    // if lastUpdate is undefined, lastUpdate is made to be 0
    //lastUpdate = typeof lastUpdate !== 'undefined' ? lastUpdate : 0;

    setTimeout(function() {
	console.log('update loop every ' + interval + ' ms ' +
		    'with last update at ' + lastUpdate);

	if (continueUpdate == true) {
	    // Update server with client's IP address
	    brain.update(function(err, reply) {
		if (err) {
		    console.log('error: ' + err);
		    
		} else {
		    console.log('update successful: ' + reply);
		}
	    });

	    // keep looping
	    updateLoop(interval, lastUpdate);
	}
    }, interval);
}



    
//    log.output('update loop every ' + interval + ' ms ' +
//	       'with last update at ' + lastUpdate);




    // get time of last update
    // get time of now
    // if time elapsed since last update is greater than update-interval    

    //   update
    //   set time of last update to now

//     var now = Date.now();
//     //console.log('now is ' + now);
//     //log.output('now is ' + now);

//     if (now - lastUpdate > interval) {
	
// 	// do an update
// 	lastUpdate = now;


// 	// if looping is supposed to continue, continue
//     }

// }
//function setConfig(conf) {
    // this should run after getConfig.
    // this sets the configurations for the update client
    // such as update interval
    
    
//}

//function update(){ 
  // update the brain with the client's current ip address.
  // does not retrieve user configurations

//  brain.update();
//}
