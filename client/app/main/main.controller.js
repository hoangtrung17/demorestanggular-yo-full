'use strict';

angular.module('demoappFullStackApp')
  .controller('MainCtrl', function ($scope, $http, socket, Restangular) {
    $scope.awesomeThings = [];

    // $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
     var Todos = Restangular.all('api/things');

    Todos.getList()  // GET: /things
    .then(function(docs) {
      // returns a list of things
      $scope.todos = docs; // first Restangular obj in list: { id: 123 }
    })

    $scope.addTodo = function () {
      Todos.post($scope.todo)
      .then(function(docs) {
        $scope.todos.push($scope.todo);
        $scope.todo = '';
      });      
    };

    $scope.removeTodo = function (index) {
      $scope.todos.splice(index, 1);
    };


    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });


  });
