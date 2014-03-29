var app = angular.module('myapp', ['ngRoute']);

/******************************************************************/
/* ROUTER                                                         */
/******************************************************************/
app.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: "links.html",
    controller:'linkController'
  })
  .when('/create', {
    templateUrl:'create.html',
    controller:'createLinkController'
  })
  .otherwise({redirectTo: '/'});
}]);

/******************************************************************/
/* CONTROLLER                                                     */
/******************************************************************/
app.controller('linkController', function($scope, $http){
  $http({
    method:'GET',
    url:'links'
  }).then(function(data){
    $scope.links = data.data;
  });
});

app.controller('createLinkController', function($scope, $http){
  $scope.createLink = function(){
    console.log('submitted');
  };
});