'use strict';

/**
 * @ngdoc overview
 * @name unbankApp
 * @description
 * # unbankApp
 *
 * Main module of the application.
 */
angular
  .module('unbankApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',/*or index.html instead of views/index.html ? */
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html', /*just for shits */
        controller: 'AboutCtrl'
      })
      /*ADD ANOTHER ROUTE RIGHT HERE! */
      .when('/locations', {
        templateUrl:'poly/locations.html',
        controller: 'LocationsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
