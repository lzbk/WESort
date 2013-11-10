/**
 * UglyAuthentication
 * Content: Handling authentication with socket.io
 * Created by loizbek on 01/11/13.
 */

define(['uglyAuth', 'lib/socket.io.min'], function(UglyAuth, io){
    var UglyAuth_io = UglyAuth.extend({
        init: function(id, configSource, extraParameters){
            if(typeof configSource == "string"){
                configSource = Util.loadJSON(configSource);
            }
            this._super(id, configSource.authentication, extraParameters);
            var self = this;
            this.onSendForm(function(){//only called if form is OK see uglyAuth.js
                /**/console.log(configSource.websocket.url+
                    ":"+configSource.websocket.port
                    +self.fieldsToUrl());
                self.socket = io.connect(configSource.websocket.url+
                    ":"+configSource.websocket.port
                    +self.fieldsToUrl()
                );
                self.initCallbacks(id);
            });//end send Form
        },

        initCallbacks: function(id){
            var self = this;
            $('#'+id).append("started connection");
            this.socket.on("connection established", function(data){
                $('#res').append("<h2> Alors…"+JSON.stringify(data)+"</h2>");
                self.hideForm();
            });
            this.socket.on("connection denied", function(data){

            });
        },

        getSocket: function(){
            if(typeof this.socket == "undefined"){
                return false;
            }
            else{
                return this.socket;
            }
        }

    });

    return UglyAuth_io;
});