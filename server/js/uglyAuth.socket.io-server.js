/**
 * UglyAuth
 * Content: Handling authentication with socket.io
 * Created by loizbek on 02/11/13.
 * Contains a function that adds the proper events to handle authentication with UglyAuth on the server side
 * needs :
 *   + "db" handler, i.e. an object that posesses :
 *     - a “createUser” method that takes of a type that can be passed by uglyAuth client (strings so far) :
 *         * a user name
 *         * an encrypted password
 *         * an e-mail address
 *         * an avatar
 *         * a call back function. This function takes two parameters :
 *             → message data (either an object containing values to pass to the handshake data or an error string)
 *             → boolean (accept connection or not).
 *     - an “auth” method that takes
 *          * an email
 *          * an encrypted password
 *          * the same call back function as the db handler
 *     It is the responsibility of the db and websocket handlers to call it depending on the situation
 *   + a socket.io websocket handler
 * The server that passes on to uglyAuth its db and websocket handler has the responsibility
 * to perform the connexion procedure once its websocket handler has authorized the connection thanks to the
 * db handler methods, set up by uglyauth
 *
 */

var cls = require('./lib/class');
/*//if we need sha    jsSHA = require('../../shared/sha1.js');
var shaObj = new jsSHA(handshakeData.query.password, 'TEXT');
var hash = shaObj.getHash("SHA-1", 'B64');*/

module.exports = uglyAuth = function(io, dbh){
       authorize = function(handshakeData,io_accept){ //io_accept is a socket.io callback function

           //accept update encapsulates this function in order to be able to update handshakeData
           //called with one parameter it updates handshake data, with 2, it does both (unless param1
           //is just a string)
           var acceptUpdate = function(newValues, result){
                   if((typeof result == "boolean") && (result === false)){
                       io_accept(newValues, result);
                   }
                   else{
                       if(typeof newValues == "object"){
                           Object.keys(newValues).forEach(function (key) {
                               /**/console.log(key, newValues[key]);
                               handshakeData.query[key]=newValues[key];
                           });
                       }
                       if((typeof result == "boolean") && (result === true)){
                       //this way it can be called just to update handshakeData
                           io_accept(null, true);
                       }
                   }
               };
           if (handshakeData.query.action == "register"){
               //registration procedure
               dbh.createUser(handshakeData.query.gameId, handshakeData.query.username,
                   handshakeData.query.password, handshakeData.query.email,
                   handshakeData.query.avatar, acceptUpdate);
           }
           else if (handshakeData.query.action == "login"){
               //login procedure
               if(typeof handshakeData.query.playerId !== "undefined"){
                   dbh.auth(handshakeData.query.gameId, handshakeData.query.playerId, acceptUpdate);
               }
               else{
                    dbh.auth(handshakeData.query.gameId, handshakeData.query.email,
                        handshakeData.query.password, acceptUpdate);
               }
           }
           else{
               io_accept("Action “"+handshakeData.query.action+"” is not allowed", false);
           }
           //io_accept called in the db… callback chain
       };
       io.configure(function(){
           io.set('authorization', authorize);
       });
   };