'use strict';

/**
* @ngdoc overview
* @name sgas
* @description # sgas
* 
* Main module of the application.
*/
angular.module(
		'sgas',
		['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize',
				'ngTouch', 'angular-jwt', 'angular-storage']).config(
		function ($routeProvider, $httpProvider, jwtInterceptorProvider) {

		    $routeProvider

			.when('/', {
			    templateUrl: 'views/main.html',
			    controller: 'MainCtrl',
			    controllerAs: 'main',
			    publicView: true
			})

			.otherwise({
			    redirectTo: '/'
			});

		    // JWT-Token
		    jwtInterceptorProvider.tokenGetter = function (store) {
		        return store.get('token');
		    };
		    $httpProvider.interceptors.push('jwtInterceptor');

		}).run(
		function ($rootScope, $location, store, jwtHelper) {
		    $rootScope.logged = false;

		    // App-Access
		    $rootScope.$on('$routeChangeStart', function (event, next, current) {
		        if (!next.publicView) {
		            if (!store.get('token')
							|| jwtHelper.isTokenExpired(store.get('token'))) {
		                event.preventDefault();
		                store.remove('me');
		                store.remove('token');
		                $location.path("/");
		            } else {
		                $rootScope.logged = true;
		            }
		        }
		    });
		});