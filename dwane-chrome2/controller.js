
var addr = "http://dwane.co";


if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
  // Compatibility for running under app_shell, which does not have app.window.
  var createWindow =
      chrome.shell ? chrome.shell.createWindow : chrome.app.window.create;

  var showUpdaterWindow = function () {
    createWindow('updater.html', {
      innerBounds: {
        width: 240, minWidth: 240, maxWidth: 240,
        height: 300, minHeight: 300, maxHeight: 300
      },
      id: 'updater'
    }, function(appWindow) {
      appWindow.contentWindow.onload = function() {
        new Controller(new Model(9), new View(appWindow.contentWindow));
      };
    });
  }

  chrome.app.runtime.onLaunched.addListener(showUpdaterWindow);
}



function Controller(model, view) {

    console.log('controller creation. model: ' + model + ' and view: ' + view);
    this.model = model;
    this.view = view;

    // when the view changes, (user changes a textbox), update the model
    this.view.onChange = function onChange(event) {
        this.handleViewChange_(event)
    }.bind(this);

    // when the model changes (loaded saved data, server response), update the view
    console.log('defining onchagne');
    this.model.onChange = function onChange(data) {
        this.handleModelChange_(data)
    }.bind(this);
}


Controller.prototype.handleViewChange_ = function handleViewChange_(event) {
    console.log('view changed');
    console.dir(event);
    
    // update the model
    this.model.save({'data': {}});
}

Controller.prototype.handleModelChange_ = function handleModelChange_(data) {
    console.log('handling model change');
    
    // update the view
    this.view.setValues(data);
}


Controller.prototype.update_ = function update_(uid) {
    console.log('controller update func');

    var xhr = new XMLHttpRequest();
    //xhr.open('GET', addr + '/api/config/' + uid + '/' + cid, true);
	xhr.open('GET', addr + '/api/config/' + uid, true);
    xhr.onreadystatechange = function (event) {
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
Controller.prototype.onResponse_ = function onResponse(err, res) {
    console.log('got reply: ' + res);
}