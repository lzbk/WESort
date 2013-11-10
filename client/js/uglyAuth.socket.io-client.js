/**
 * UglyAuthentication
 * Content: Handling authentication with socket.io
 * Created by loizbek on 01/11/13.
 */

define(['uglyAuth', 'lib/socket.io.min'], function(UglyAuth, io){
    var UglyAuth_io = UglyAuth.extend({
        init: function(id, configSource){
            if(typeof configSource == "string"){
                configSource = Util.loadJSON(configSource);
            }
            window.alert(configSource.authentication);/**/
            this._super(id, configSource.authentication);
//
//
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
                self.hideForm();
            });//end send Form
        },

        initCallbacks: function(id){
            $('#'+id).append("started connection");
            this.socket.on('news', function (data) {
                console.log(data);
                $('#'+id).append("blabla"+JSON.stringify(data));
                this.socket.emit('my other event', { my: 'data' });
            });
            this.socket.on("test2", function(data){
                $('#'+id).html("<h2>"+data.message+"</h2>");
            });
            this.socket.on("content", function(data){$('#res').append("<h2> Alors…"+JSON.stringify(data)+"</h2>");});
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