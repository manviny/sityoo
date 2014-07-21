'use strict';

/**
 * @ngdoc function
 * @name sityooApp.controller:UneteCtrl
 * @description
 * # UneteCtrl
 * Controller of the sityooApp
 */
angular.module('sityooApp')
  .controller('UneteCtrl', function ($scope, chatIO, $cordovaDialogs, $filter) {


        //IMPORTANTE  si hay ya chatsOrdenados -> carga de variable  y no de promise
        
        chatIO.getChatsAbiertos()
        .then(function(chats){
        	console.debug("chats", chats);
            $scope.chatsOrdenados = chats; 
        });


  });
