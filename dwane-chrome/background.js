chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('control.html', {
	id: 'controlpanel',
	'bounds': {
	    'width': 600,
	    'height': 400
	}
    });
});


chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set(object items, function callback);
});