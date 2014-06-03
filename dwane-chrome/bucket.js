// The "Bucket" of the program.
// a fancy place to store persistant
// and temporary data

(function (exports) {

    /**
     * Constructor
     */
    function Bucket() {
	// var which holds configurations throughout app execution.
	this.config = {};

	this.config.defaults = {
	    updateInterval: '600000',
	    cid: '1234-1234-1234-1234',
	    uid: '1234-0',
	    ip: ''
	}
    }

    // @todo all these functions need actual error checking
    Bucket.prototype.getKey = function(key, callback) {
	var value = this.config[key];
	log.output('Bucket::getKey: here is config as-is: ' + JSON.stringify(this.config));
	log.output('Bucket::getKey: key to get: ' + key);

	if (!value) return callback(null, undefined);
	callback(null, value);
    }
    
    Bucket.prototype.getConfig = function(callback) {
	callback(null, this.config);
    }

    Bucket.prototype.getDefault = function(key, callback) {
	callback(null, this.config.defaults[key]);
    }

    Bucket.prototype.getDefaultConfig = function(callback) {
	callback(null, this.config.defaults);
    }

    Bucket.prototype.setKey = function(key, value, callback) {
	this.config[key] = value;
	console.log('bucket setted:');
	console.dir(this.config);
	callback(null, true);
    }

    Bucket.prototype.setConfig = function(conf, callback) {
    	this.config = conf;
	this.save; // @todo remove this when adding the timer function for automatic saving
     	callback(null, this.config);
    }


    Bucket.prototype.save = function(callback) {
	chrome.storage.local.set({ 'config': config }, function() {
	    chrome.storage.local.get(null, function(items) {
		log.output('bucket saved');
		console.dir(items);
		callback(null, true);
	    });
	});
    }

    // @todo timer function to save automatically every n minutes

    exports.Bucket = Bucket;

})(window);

