'use strict';

angular.module('demoappFullStackApp')
  .controller('MainCtrl', function ($scope, $http, socket, Restangular) {
    $scope.awesomeThings = [];

    // $scope.todos = ['Item 1', 'Item 2', 'Item 3'];
    // $scope.todos = Restangular.all('api/todos');

    Restangular.all('api/todos').getList()  // GET: /users
    .then(function(docs) {
      // returns a list of users
      $scope.todos = docs; // first Restangular obj in list: { id: 123 }
    })

    $scope.addTodo = function () {
      $scope.todos.push($scope.todo);
      $scope.todo = '';
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
