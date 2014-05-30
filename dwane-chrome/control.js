


// quick terminal->textarea simulation
var log = (function(){
  var area=document.querySelector("#log");
  var output=function(str) {
    if (str.length>0 && str.charAt(str.length-1)!='\n') {
      str+='\n'
    }
    area.innerText=str+area.innerText;
    if (console) console.log(str);
  };
  return {output: output};
})();


chrome.runtime.getBackgroundPage(function(bgPage) {
    
    bgPage.log.addListener(function(str) {
	log.output(str);
    });

    document.getElementById('start').addEventListener('click', function() {
	// change the start button to a stop button
	var startBtn = document.getElementById('start');
	var stopBtn = document.getElementById('stop');
	startBtn.style.display = 'none';
	startBtn.disabled = true;
	stopBtn.style.display = 'block';
	stopBtn.disabled = false;
	
	// get user or client id entered in box
	var uid=document.getElementById('uid').value;
//	log.output('uid equals: ' + uid);
//	if (typeof uid == undefined) uid = 'fart'; //defaults.uid;
	    

	bgPage.startBrain(uid);
	chrome.storage.local.set({ 'id': uid }, function() {
	    chrome.storage.local.get(null, function(items) {
		log.output('herrs yo items: ');
		console.dir(items);
	    });
	});
    });


    document.getElementById('stop').addEventListener('click', function() {
	// change the start button to a stop button
	var startBtn = document.getElementById('start');
	var stopBtn = document.getElementById('stop');
	startBtn.style.display = 'block';
	startBtn.disabled = false;
	stopBtn.style.display = 'none';
	stopBtn.disabled = true;

	bgPage.stopBrain();

    });


    chrome.storage.local.get(null, function(items) {
	document.getElementById('uid').value = items.id;
	console.dir(items);
    });



});
    
// setConnectedState(addr, port);
// bgPage.startServer(addr, port);

// get config from brain
// show user that it is started

    

