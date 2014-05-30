/*
 * This module communicates with the dwane.co brain,
 * handles request authentication,
 * retrieves user configuration,
 * and processes client IP address updates
 */


(function (exports) {

    //addr = "http://dwane.co";
    var addr = "http://monitor.twoway.net:22454";

    function Brain(id) {

	this.id = id;
	
	this.callbaks = {
	    gotConfig: null,
	};

	//this.log('set up brain');

    };

    Brain.prototype.update = function(callback) {

	var xhr = this.createXhr();
	xhr.open('GET', addr + '/api/config/' + this.id, true);
	xhr.onreadystatechange = function (evt) {
	    if (xhr.readyState === 4) {
		// request finished and response is ready
		//callback(null, xhr.repsponseText);
		callback(null, xhr.status + ': ' + xhr.responseText);
		
	    //} else {
            //callback(xhr.readyState, null);
	    }
	}
	xhr.send(null);
    };

    Brain.prototype.getConfig = function(id, cid, callback) {
	var xhr = this.createXhr();
	xhr.open('GET', addr + '/api/config/' + id + '/' + cidp, true);
	xhr.onreadystatechange = function (evt) {
	    if (xhr.readyState === 4) {
		// request finished and response is ready
		log(xhr.responseText);
		callback(xhr.responseText);
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

