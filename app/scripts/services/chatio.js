'use strict';

/**
 * @ngdoc service
 * @name sityooApp.chatIO
 * @description
 * # chatIO
 * Factory in the sityooApp.
 */
angular.module('Sityoo.services')
  .factory('chatIO', function ($q, $cordovaGeolocation, $cordovaDialogs, $rootScope) { 

                  
          
    /** 
     * variables globales
     */ 
    var nickName;           // nick del usuario
    var userEmail;          // email del usuario  
    var userPass;           // passw del usuario    
    var userID;             // id unica en la BD externa e interna
    var chatsAbiertos;      // chats Abiertos y ordenados por cercania al usuario
    var userPosition;       // user position
//    var tabbarShouldHide = "false";
    
    /**
     * Inicializa
     */ 
     
        // borra user de la BD SOLO para hace pruebas
//        var db = window.openDatabase("Database", "1.0", "sityooDB", 1024*1024);
//        db.transaction(function executeQuery(tx) { tx.executeSql('DELETE FROM userTable'); })
        
        
        // lee usuario desde BD
        var db = window.openDatabase("Database", "1.0", "sityooDB", 1024*1024);
        db.transaction(
            function executeQuery(tx) {      
                tx.executeSql('SELECT * FROM  userTable', [], 
                    function querySuccess(tx, results) {
                        var len = results.rows.length;
                        for (var i=0; i<len; i++){
                            nickName = results.rows.item(i).username; 
                            userEmail = results.rows.item(i).email;
                            userPass = results.rows.item(i).password;
                            userID = results.rows.item(i).id;
                        } 
                    },
                    function errorCB(err) {console.log("Error occured while executing SQL: "+err.code);}
                );
            }, 
            function errorCB(err) {console.log("Error occured while executing SQL: "+ err.code);},
            function successCB() { console.log("usuario desde BD");}
        ); 
    
    /**
     * Funciones
     */ 

    var setNickName = function (name){ nickName = name };
    var getNickName = function (){ return nickName };
    var getuserID = function (){ return userID };
    var setuserID = function (id){ userID: id };
    var setUserPass = function (name){ userPass = name };
    var UserPass = function (){ return userPass };
    var setUserEmail = function (name){ userEmail = name };
    var UserEmail = function (){return userEmail }; 
    var showTabbar = function (){ $rootScope.tabbarShouldHide = "false"; };    
    var hideTabbar = function (){ $rootScope.tabbarShouldHide = "true"; }; 
    
    var getChatsAbiertos = function (){
        var deferred = $q.defer();
        dpd.chatsabiertos.get(function(chatsabiertos) { // chats desde BD
            $cordovaGeolocation.getCurrentPosition().then(function(position) { // posicion del user
                userPosition = position; 
                chatsOrdenados = _.map( _.sortBy(chatsabiertos, function(items){  
                    // 1.- calcula distancias
                    items.distance = Math.sqrt (Math.pow( (items.latitude-(userPosition.coords.latitude)),2) + Math.pow( (items.longitude-(userPosition.coords.longitude)),2)) * 100;
                    // 2.- colores de los marcadores
                    items.color = 'green';
                    if(items.distance > 0.12) items.color = 'coral'; // + de 150 metros
                    if(items.distance > 0.6) items.color = 'purple '; // + de 600 m
                    return Math.abs(items.latitude-(userPosition.coords.latitude)) +  Math.abs(items.longitude-(userPosition.coords.longitude)) 
                }));                 
                chatsAbiertos = chatsOrdenados;
                deferred.resolve(chatsOrdenados);
            }); 
        });
        return deferred.promise;
    }; 
    
    var chatsAbiertos = function (){ return chatsAbiertos }; 
    
    var getUserPosition = function (){
        var deferred = $q.defer();
        $cordovaGeolocation.getCurrentPosition().then(function(position) {
            deferred.resolve(position); 
            userPosition = position;
        });   
        return deferred.promise;
    }; 
    var userPosition = function (){ return userPosition }; 


    /** 
     * funciones para la BD
     */
    //save user data
    var saveUserToDB = function(user){

            
        // 1.- guarda nuevo usuario en BD externa

        dpd.users.put({ //datos desde el formulario
              id: user.userID,
              username: user.nickName,
              email: user.userEmail,
              password: user.userPass
             
        }, function(message, err) {
            if(_.isUndefined(err)) { 
                // A => NO hay errores -> crea el usuario en la BD del telefono
                alert("recibido de deploy "  + JSON.stringify(message));
                
                // 2.- guarda usuario en BD del telefono
                var db = window.openDatabase("Database", "1.0", "sityooDB", 1024*1024);
                db.transaction(function executeQuery(tx) { tx.executeSql('DELETE FROM userTable'); })
                db.transaction(
                    function executeQuery(tx) {
                        tx.executeSql('CREATE TABLE IF NOT EXISTS userTable (id unique, username, email, password)');
                        tx.executeSql('INSERT INTO userTable (id, username, email, password) VALUES (?, ?, ?, ?)', [message.id, message.nickname, message.email, user.userPass]);    //datos devueltos desde deploy
                    } , errorCB, successCB);                  

                // 3.- set user globally
                nickName = user.nickName;           
                userEmail = user.userEmail;          
                userPass = user.userPass;
                userID = user.id;
                
                // B => error, usuario existe o no hay password
            } else alert(JSON.stringify(err));
                  
        });


        
    }   // saveUserToDB 
 
     function querySuccess(tx, results) {
        var len = results.rows.length;
//        window.alert("There are " + len + " rows of records in the database.");
        for (var i=0; i<len; i++){
//            alert(results.rows.item(i).username);
            alert("cambios guardados");
        }        
    }
 
    //Callback function when the transaction is failed.
    function errorCB(err) {
        console.log("Error occured while executing SQL: "+err.code);
    }

    // Callback function when the transaction is success.
    function successCB() {
        var db = window.openDatabase("Database", "1.0", "sityooDB", 1024*1024);
        console.log("successCB");
        db.transaction(queryDB, errorCB);
    }  

    function queryDB(tx) { tx.executeSql('SELECT * FROM userTable', [], querySuccess, errorCB);}
    
    function querySuccess(tx, results) {
        var len = results.rows.length;
        for (var i=0; i<len; i++){ $cordovaDialogs.alert("cambios guardados");}        
    }



    //get user data
    var getUserFromDB = function(){ 
        var deferred = $q.defer();
        var db = window.openDatabase("Database", "1.0", "sityooDB", 1024*1024);
        db.transaction(
            function executeQuery(tx) {      
                tx.executeSql('SELECT * FROM  userTable', [], 
                    function querySuccess(tx, results) {
                        var len = results.rows.length;
                        for (var i=0; i<len; i++){ 
//                            alert(JSON.stringify(results.rows.item(i)))
                            deferred.resolve({nickName: results.rows.item(i).username, userEmail: results.rows.item(i).email , userPass: results.rows.item(i).password , userID : results.rows.item(i).id});
                            nickName = results.rows.item(i).username; 
                            userEmail = results.rows.item(i).email;
                            userPass = results.rows.item(i).password;
                            userID = results.rows.item(i).id;
                        } 
                    },
                    function errorCB(err) {console.log("Error occured while executing SQL: "+err.code);}
                );
            }, 
            function errorCB(err) {console.log("Error occured while executing SQL: "+ err.code);},
            function successCB() { console.log("usuario desde BD");}
        ); 
        return deferred.promise;
    }     
    
    /**
     * funciones publicas
     * las funciones que empiezan por get/set son instantaneas
     * las demas son promises
     */ 
    return {
        setNickName: setNickName,
        getNickName: getNickName,
        setUserEmail: setUserEmail,
        UserEmail: UserEmail,   
        getuserID: getuserID,
        setuserID: setuserID,
        setUserPass: setUserPass,
        UserPass: UserPass,
        getChatsAbiertos: getChatsAbiertos,     // chats leidos de BD sin ordenar
        chatsAbiertos: chatsAbiertos,           // como la anterior pero la variable
        getUserPosition: getUserPosition,       // promise
        userPosition: userPosition,             // variable
        saveUserToDB: saveUserToDB,
        getUserFromDB: getUserFromDB,
        hideTabbar: hideTabbar,
        showTabbar: showTabbar
    }

    /**
     * funciones privadas
     */
     

});