'use strict';

/**
 * @ngdoc filter
 * @name sityooApp.filter:enKm
 * @function
 * @description
 * # enKm
 * Filter in the sityooApp.
 */
angular.module('sityooApp')
  .filter('enKm', function () {
    return function(distancia) {
        if (distancia == "" || distancia == null) return "";
        if(distancia<1) return  (distancia*1000).toFixed(0) + ' m.';
        return  distancia.toFixed(1) + ' km.';
    }
  });
