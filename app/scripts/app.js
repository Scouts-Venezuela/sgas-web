'use strict';

/**
 * @ngdoc overview
 * @name sgasApp
 * @description
 * # sgasApp
 *
 * Main module of the application.
 */
 angular
 .module('sgasApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-jwt',
    'angular-storage'
    ])
 .config(function ($routeProvider, $httpProvider, jwtInterceptorProvider) {

    $routeProvider

    .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        publicView: true
    })

    .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about',
        publicView: true
    })

    .otherwise({
        redirectTo: '/'
    });

    // Validación del JWT Token
    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('token');
    };
    $httpProvider.interceptors.push('jwtInterceptor');

 }).run(function($rootScope, $location, store, jwtHelper) {
    $rootScope.logged = false;

    // Validar Acceso a la app
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (!next.publicView) {
            if (!store.get('token') || jwtHelper.isTokenExpired(store.get('token'))) {
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

