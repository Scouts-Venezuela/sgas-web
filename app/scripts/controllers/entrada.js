'use strict';

/**
 * @ngdoc function
 * @name sgasApp.controller:EntradaCtrl
 * @description
 * # EntradaCtrl
 * Controller of the sgasApp
 */
angular.module('sgasApp')
    .controller('EntradaCtrl', function ($rootScope, $scope, $location, jwtHelper, store, apiService) {

        if (store.get('token') && !jwtHelper.isTokenExpired(store.get('token'))) {
            $rootScope.logged = true;
            $location.path("/main");
        }

        $scope.login = {};

        $scope.button = {
            text: 'Iniciar sesión',
            enable: true
        };

        $scope.iniciarSesion = function() {
            $scope.button = {
                text: 'Espere...',
                enable: false
            };
            $rootScope.oneAlert('Autenticando...', 'info');

            apiService.inicioSesion($scope.login)
            .then(function(response){
                var rsp = $rootScope.httpCode(response.status);
                if ( rsp ) {
                    var token = response.data.token;
                    var identidad = jwtHelper.decodeToken(token);
                    var me = {
                        id: identidad.id,
                        nombre: identidad.primer_nombre+' '+identidad.segundo_nombre+' '+identidad.primer_apellido+' '+identidad.segundo_apellido,
                        nivel: identidad.nivel,
                        estructura: identidad.estructura_id,
                        region: identidad.region_id,
                        distrito: identidad.distrito_id,
                        grupo: identidad.grupos_id,
                        rama: identidad.ramas_id,
                        tipo: identidad.tipo,
                        ultima: identidad.ultima_conexion,

                        expire: identidad.exp,
                        create: identidad.iat
                    };
                    $rootScope.logged = true;
                    $rootScope.resetAlert();
                    store.set('token', token);
                    store.set('me', me);
                    $location.path("/main");
                }
            }, function(error){
                var rsp = $rootScope.httpCode(error.status);
                    $rootScope.oneAlert(rsp);
                    $scope.button = {
                        text: 'Iniciar sesión',
                        enable: true
                    };
            });
        };

    }
);
