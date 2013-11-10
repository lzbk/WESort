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
           var acceptUpdate = function(newValues, result){
                   if(result === false){
                       io_accept(newValues, result);
                   }
                   else{
                       if(typeof newValues == "object"){
                           Object.keys(newValues).forEach(function (key) {
                               handshakeData.query[key]=newValues[key];
                           });
                       }
                       io_accept(null, true);
                   }
               };
           if (handshakeData.query.action == "register"){
               //registration procedure
               dbh.createUser(handshakeData.query.username,
                   handshakeData.query.password, handshakeData.query.email,
                   handshakeData.query.avatar, acceptUpdate);
           }
           else if (handshakeData.query.action == "login"){
               //login procedure
               dbh.auth(handshakeData.query.email, handshakeData.query.password, io_accept);
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