'use strict';

/**
 * @ngdoc service
 * @name sgas.api
 * @description
 * # api
 * Service in the sgas.
 */
angular.module('sgas')
  .service('apiService', function ($http) {
  	var base = 'http://localhost/restful/';

     // Función para convertir los objetos $scope a x-www-form-urlencoded
    function obj2url(obj, name) {
        var str = [];
        for(var p in obj){
            if (name) {
                str.push(encodeURIComponent(name)+'%5B'+encodeURIComponent(p) + '%5D=' + encodeURIComponent(obj[p]));
            } else {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
        }
        return str.join('&');
    }

    // Public API here
    return {
        inicioSesion: function(login) {
            return $http({
                method: 'POST',
                url: base+'acceso',
                data: obj2url(login),
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            });
        }
    };
  });
