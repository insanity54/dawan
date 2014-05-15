/*
 * This module communicates with the dwane.co brain,
 * handles request authentication,
 * retrieves user configuration,
 * and processes client IP address updates
 */


(function (exports) {

    //addr = "http://dwane.co";
    var addr = "http://monitor.twoway.net:22454";

    function Brain() {

	this.callbaks = {
	    gotConfig: null,
	};

	//this.log('set up brain');

    };

    Brain.prototype.getConfig = function(uid, callback) {
	var xhr = this.createXhr();
	xhr.open('GET', addr + '/api/config/' + uid, true);
	xhr.onreadystatechange = function (evt) {
	    if (xhr.readyState === 4) {
		callback(xhr.responseText);
	    } else {
		callback('get config request fial');
	    }
	}
	xhr.send(null);
    };
    

    Brain.prototype.createXhr = function() {
	var xhr, i, progId;
	if (typeof XMLHttpRequest !== "undefined") {
	    return new XMLHttpRequest();
	} else {
	    throw new Error("Not compatible with microsoft aktive X");
	}

	return xhr;
    };

    function log(msg) {
	console.log(msg);
    }
    
    exports.Brain = Brain;
    

})(window);

