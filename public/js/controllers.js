var dwaneCP = angular.module('dwaneCP', []);

dwaneCP.directive('draggable', function() {
    return function(scope, element) {
	// element becomes the native JS object of the element with the 'draggable' attribute
	var el = element[0];

	el.draggable = true;

	el.addEventListener(
	    'dragstart',
	    function(e) {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('Text', this.id);
		this.classList.add('drag');
		return false;
	    },
	    false
	);

	el.addEventListener(
	    'dragged',
	    function(e) {
		this.classList.remove('drag');
		return false;
	    },
	    false
	);
    }
});

//ccc
dwaneCP.directive('droppable', function() {
    return {
	scope: {
	    drop: '&', // parent
	    client: '=', // bi-directional scope
	    role: '='
	},
	link: function(scope, element) {
	    var el = element[0];

	    el.addEventListener(
		'dragover',
		function(e) {
		    e.dataTransfer.dropEffect = 'move';
		    // allows us to drop
		    if (e.preventDefault) e.preventDefault();
		    this.classList.add('over');
		    return false;
		},
		false
	    );

	    el.addEventListener(
		'dragenter',
		function(e) {
		    this.classList.add('over');
		    return false;
		},
		false
	    );

	    el.addEventListener(
		'dragleave',
		function(e) {
		    this.classList.remove('over');
		    return false;
		},
		false
	    );

	    el.addEventListener(
		'drop',
		function(e) {
		    // Stop some browsers from redirecting
		    if (e.stopPropagation) e.stopPropagation();
		    if (e.preventDefault) e.preventDefault();

		    this.classList.remove('over');

		    // if roles match, process the drop
		    console.log('datatransfertext: ' + e.dataTransfer.getData('Text'));
		    //if (scope.role == e.dataTransfer.getData(''))
		    
		    var binId = this.id;
		    var item = document.getElementById(e.dataTransfer.getData('Text'));
		    this.appendChild(item);
		    // call the passed drop function

		    scope.$apply(function(scope) {
			var fn = scope.drop();
			if ('undefined' !== typeof fn) {
			    fn(item.id, binId);
			}
		    });

		    return false;
		},
		false
	    );
	}
    }
});

dwaneCP.controller('DragDropCtrl', function($scope) {
    $scope.handleDrop = function() {
	console.log('item has ben droppe');
	alert('Item has been dropped');
    }
});

dwaneCP.controller('ClientListerCtrl', function($scope, Client) {
    Client.list(function(clients) {
	$scope.clients = clients.clients;
    });
});

	
//    $http.get('/api/user/3636540bf2-0').success(function(data) { // get the user's clients and domains @todo soft code the uid
//      $scope.clients = data.clients;
      // scope.domains = data.domains;  // something like this
//    });
//});
    

dwaneCP.factory('Client', function($http) {
    var cachedData;
    function getData(callback) {
	if (cachedData) {
	    callback(cachedData);
	} else {
	    $http.get('/api/user/3636540bf2-0').success(function(data) {
		cachedData = data;
		callback(data);
	    });
	}
    }
    return {
	list: getData,
	find: function(name, callback) {
	    getData(function(data) {
		var client = data.filter(function(entry) {
		    return entry.name === name;
		})[0];
		callback(client);
	    });
	}
    };
});
	