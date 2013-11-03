/**
 * UglyAuthentication
 * Content: Handling authentication with socket.io
 * Created by loizbek on 02/11/13.
 */

var cls = require('./lib/class'),
    jsSHA = require('../../shared/sha1.js');

module.exports = UglyAuth = cls.Class.extend({
    init: function(io, dbh, configPath){
        this.config = require(configPath);
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
       this.authorize = function(handshakeData,io_accept){ //accept is a socket.io callback function
           console.log(handshakeData);/**/
           if (handshakeData.query.action == "register"){
               //registration procedure
               //the database should contain the fields that are provided in the get request
               //this.db.createUser(handshakeData, io_accept);
               var shaObj = new jsSHA(handshakeData.query.password, 'TEXT');
               var hash = shaObj.getHash("SHA-1", 'B64');
               console.log(handshakeData.query.password, hash);/**/
               self.db.test();

           }
           else if (handshakeData.query.action == "login"){
               //login procedure
               //this.db.auth(handshakeData, io_accept);
           }
           else{
               return io_accept("Action “"+handshakeData.query.action+"” is not allowed", false);
           }
           return io_accept(null, true);

       };
   },

    createUser: function(handshakeData,io_accept){

    }

});