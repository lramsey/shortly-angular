var app = angular.module('myapp', ['ngRoute']);

// app.config('$routeProvider', function($routeProvider){
//     $routeProvider.when('/',{
//       templateUrl: "client/linkController.html",
//       controller:'linkController'
//     });
//   });

app.controller('linkController', function($scope, $http){
  $http({
    method:'GET',
    url:'links'
  }).then(function(data){
    console.log(data);
    $scope.links = data.data;
  });
});


// app.service('LinkService', function(){
//   this.getLinks = function(){
//     $http({
//       method: 'GET', 
//       url: '/links'
//     });
//   };
// });