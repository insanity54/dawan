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
		    }
		},
		    function(w) {
			commandWindow = w;
		    });
	}
});
