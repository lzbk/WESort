/**
 * UglyAuthentication
 * Content: Handling authentication with socket.io
 * Created by loizbek on 02/11/13.
 */

var cls = require('./lib/class');/*,
    jsSHA = require('../../shared/sha1.js');*/
//var shaObj = new jsSHA(handshakeData.query.password, 'TEXT');
//var hash = shaObj.getHash("SHA-1", 'B64');

module.exports = UglyAuth = cls.Class.extend({
    init: function(io, dbh){
        this.db = dbh;
        this.io = io;
        var self = this;
        this.init_callbacks();
        self.io.configure(function(){
            self.io.set('authorization', self.authorize);
        });
    },

   init_callbacks: function(){
       var self=this;
       this.authorize = function(handshakeData,io_accept){ //io_accept is a socket.io callback function
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
                       self.io.emit('test2', handshakeData.query);
                   }
               };
           if (handshakeData.query.action == "register"){
               //registration procedure
               self.db.createUser(handshakeData.query.username,
                   handshakeData.query.password, handshakeData.query.email,
                   handshakeData.query.avatar, acceptUpdate);
           }
           else if (handshakeData.query.action == "login"){
               //login procedure
               self.db.auth(handshakeData.query.email, handshakeData.query.password, io_accept);
           }
           else{
               io_accept("Action “"+handshakeData.query.action+"” is not allowed", false);
           }
           //io_accept called in the db… callback chain
       };
   }

});