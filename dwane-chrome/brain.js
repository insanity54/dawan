(function (exports) {

    //addr = "http://dwane.co";
    addr = "http://monitor.twoway.net";

    function Brain(){};

    Brain.getConfig = function(uid, callback) {
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

    
    exports.Brain = Brain;
    

}(window));

