
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

//    bgPage..addListner(function(conf) {
//	
//    });

    document.getElementById('start').addEventListener('click', function() {
	var uid=document.getElementById('uid').value;

	// create object to communicate with brain
	//log.output('start button clicked');
	bgPage.startBrain(uid);



//	brain = new Brain();
//	log.output(brain.getConfig());

    });

});
    
//    setConnectedState(addr, port);
//    bgPage.startServer(addr, port);

    // get config from brain
    // show user that it is started

    

