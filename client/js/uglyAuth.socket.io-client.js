/**
 * UglyAuthentication
 * Content: Handling authentication with socket.io
 * Created by loizbek on 01/11/13.
 */

define(['uglyAuth', 'lib/socket.io.min'], function(UglyAuth, io){
    var UglyAuth_io = UglyAuth.extend({
        init: function(id, url, port, configSource, extraParameters){
            this._super(id, configSource, extraParameters);
            var self = this;
            this.onSendForm(function(){//only called if form is OK see uglyAuth.js
                self.initCallbacks(id);
                self.socket = io.connect(url+":"+port+self.fieldsToUrl());
            });//end send Form
        },

        initCallbacks: function(id){
            var self = this;
            $('#'+id).append("started connection");/**/
            this.socket.on("connection established", function(data){
                self.connectSucces(data);
                $('#'+id).append("<h2> Alors…"+JSON.stringify(data)+"</h2>");/**/
                /**///self.hideForm();
            });
            this.socket.on("connection denied", function(data){
                self.connectFailure(data);
            });
        },

        getSocket: function(){
            if(typeof this.socket == "undefined"){
                return false;
            }
            else{
                return this.socket;
            }
        },

        onConnectSuccess: function(callback){
            this.connectSucces = callback;
        },

        onConnectFailure: function(callback){
            this.connectFailure = callback;
            //Je sais plus où j'en suis réfléchir par rapport au game quand on fait quoi ? ICITE
        },

    });

    return UglyAuth_io;
});