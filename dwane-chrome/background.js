var brain;
var controlWindow;

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

function onGotConfig(conf) {
    // get update-interval value and set this client's interval to that value
    conf = JSON.parse(conf);

    log.output('testing json. ' + conf.ui);

    console.log('');

    setInterval(function() {
	brain.update();

    }, conf.ui);
}

function setConfig(conf) {
    // this should run after getConfig.
    // this sets the configurations for the update client
    // such as update interval
    
    
}

//function update(){ 
  // update the brain with the client's current ip address.
  // does not retrieve user configurations

//  brain.update();
//}
