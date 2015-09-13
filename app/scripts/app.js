'use strict';

/**
 * @ngdoc overview
 * @name sgas
 * @description
 * # sgas
 *
 * Main module of the application.
 */
 angular
 .module('sgas', [
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
        templateUrl: 'views/login.html',
        controller: 'loginCtrl',
        controllerAs: 'login',
        publicView: true
    })
    .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
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
    $rootScope.$on('$routeChangeStart', function(event, next) {
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

    // Sistema de Alertas
    $rootScope.alerts = [];
    $rootScope.addAlert = function(mensaje, tipo) {
        tipo = (tipo === undefined)?'warning':tipo;
        $rootScope.alerts.push({msg: mensaje, type: tipo});
    };
    $rootScope.oneAlert = function(mensaje, tipo) {
        $rootScope.alerts = [];
        tipo = (tipo === undefined)?'warning':tipo;
        $rootScope.alerts.push({msg: mensaje, type: tipo});
    };
    $rootScope.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };
    $rootScope.resetAlert= function(){
        $rootScope.alerts = [];
    };

    // Helper para la interpretación del status de retorno del servidor
    $rootScope.httpCode = function(code) {
        var msg = 'Oops!!! ha de ocurrir un error, esto sí que no lo esperabamos :(';
        if (code === 500){
            msg = 'Error interno en el Servidor';
        } else if (code === 400) {
            msg = 'Parámetros no recibidos';
        } else if (code === 401) {
            msg = 'Usuario o Contraseña incorrectos';
        } else if (code === 403) {
            msg = 'Acceso Denegado';
        } else if (code === 404){
            msg = 'Servidor no encontrado, verifique su conexión a internet';
        } else if (code === 200 || code === 202 || code === 201){
            return true;
        }
        return msg;
    };
});

