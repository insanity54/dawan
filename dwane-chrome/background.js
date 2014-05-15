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


function startBrain() {
    if (brain) {
        //brain.stop();
	log.output('brain is already runnng');
    }
    // create object to communicate with brain
    brain = new Brain();
    log.output('Starting');

    brain.getConfig('12345', onGotConfig);
    log.output(brain.getConfig());
}

function onGotConfig() {
    log.output('got config');
}


    