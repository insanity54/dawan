

var addr = "http://dwane.co";


function Model() {
    
};


Model.prototype.update(uid) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', addr + '/api/config/' + uid + '/' + cid, true);
    xhr.onreadystatechange = function (evt) {
        if (xhr.readyState === 4) {
            // request finished and response is ready
            this.onResponse(null, xhr.status + ': ' + xhr.responseText);
        }
    }
    xhr.send(null);
}


/**
 * When we get a reply after doing an update
 */
Model.prototype.onResponse(err, res) {
    console.log('got reply: ' + res);
}