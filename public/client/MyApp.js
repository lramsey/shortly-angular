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
    console.log($scope.input.$valid);
    // /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/
    var data = {url:$scope.url};
    $http.post('links', data);
  };
});