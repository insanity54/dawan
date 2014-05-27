

// Config defaults
var config = {
    'id': '5432',
    'updateInterval': 600000,
    'configInterval': 900000
}


// if config in chrome.storage is undefined (configs have not been set)
// then set defaults
console.log('chrome storage----> ' + chrome.storage.local.get('config', function(items) {
    // console.log('items.config'
    // console.dir(items);
}));
	    

chrome.storage.local.get('config', function(items) {
    if (items == undefined) {
	
	console.log('config is undefined. setting configs');
	saveConfig();
    } else {
	console.log('config is defined. ALL GOOD');
    }
});


// getConfig() from server
// saveConfig() locally

// new app run
// get saved config



//console.log('chrome storage config id: ' + chrome.storage.local.config.id);

// // Load whatever is saved locally
// window.webkitRequestFileSystem(
//     PERSISTENT,
//     size,
//     function(fs) {
// 	// filesystem initted
// 	console.log('Filesystem: ' + fs);
// 	console.dir(fs);

// 	fs.root.getFile(
// 	    'config.json',
// 	    { create: true, exclusive: true },
// 	    function(fileEntry) {
// 		fileEntry.createWriter(function(fileWriter) {
// 		    console.log('fileWriter: ' + fileWriter);
// 		    fileWriter.onwriteend = function(e) {
// 			console.log('write complete');
// 		    };

// 		    fileWriter.onerror = function(e) {
// 			console.log('write fialed: ' + e.toString());
// 		    };

// 		    var blob = new Blob([config], {type: 'application/json'});
		    
		    
			 
// 		    }, function(e) {
// 			console.log('Could not request file system');
// 		    });
// 		});
// 	});
	    



function configure(key, value) {
    config[key] = value;
    saveConfig();
}


function saveConfig() {
    chrome.storage.local.config = config;
}
