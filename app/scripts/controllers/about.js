'use strict';

/**
 * @ngdoc function
 * @name unbankApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the unbankApp
 */
angular.module('unbankApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
