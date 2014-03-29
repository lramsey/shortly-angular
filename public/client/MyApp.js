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
  $scope.sortParam = 'visits';
  $scope.createdAtSort = function(){
    $scope.sortParam = 'createdAt';
    console.log($scope.sortParam);
  };

  $scope.visitsSort = function(){
    $scope.sortParam = 'visits';
  };

  $scope.titleSort = function(){
    $scope.sortParam = 'title';
  };

  $http({
    method:'GET',
    url:'links'
  }).then(function(data){
    $scope.links = data.data;
  });
});

app.controller('createLinkController', function($scope, $http){
  $scope.createLink = function(){
    debugger;
    var data = {url:$scope.url};
    console.log(createLinkForm.$invalid, $scope, data);
    $http.post('links', data);
  };
});