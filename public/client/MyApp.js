var app = angular.module('myapp', ['ngRoute']);

/******************************************************************/
/* ROUTER                                                         */
/******************************************************************/
app.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: "links.html",
    controller:'linksController'
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
app.controller('linksController', function($scope, $http){
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

app.controller('createLinkController', function($scope, $http, $location){
  $scope.createLink = function(){
    var data = {url:$scope.text};
    $http.post('links', data);
    $scope.message = $scope.text + ' has been submitted';
    $scope.text = '';
    //$location.path('/');
  };
});

app.controller('linkController', function($scope, $http, $location){
  $scope.addVisit = function(){
    $scope.link.visits = (!$scope.link.visits)? 1 : $scope.link.visits + 1 ;
    $http.post('links', $scope.link);
  };
});