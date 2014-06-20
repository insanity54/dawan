var dwaneCP = angular.module('dwaneCP', []);

dwaneCP.controller('ClientMapperCtrl', [$scope, $http, function(scope, http) {
    http.get('').success(function(data) { // get the user's clients and domains
      scope.clients = data.clients;
      scope.domains = data.domains;  // something like this
    });
}]);
    
