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
            var socket = io.connect(configSource.websocket.url+
                    ":"+configSource.websocket.port
                    /**/+"?user=test&password=azerty&action=register"
                );
            $('#'+id).append("started connection");
            socket.on('news', function (data) {
                console.log(data);
                $('#'+id).append("blabla"+JSON.stringify(data));
                socket.emit('my other event', { my: 'data' });
            });
            socket.on("test", function(data){
                $('#'+id).append("<h2>"+data.message+"</h2>");
            });
            socket.on("content", function(data){$('#res').append("<h2> Alors…"+JSON.stringify(data)+"</h2>");});
            this.socket = socket;
        }

    });

    return UglyAuth_io;
});