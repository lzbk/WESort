var config = require('../config.json');
var cls = require('./lib/class');
var dbh = new require('./dbHandler');

var Server = cls.Class.extend({
    init: function(){
        this.socketList = [];
        this.tst=[];
        this.db = new dbh(config.db);
        this.io = require('socket.io').listen(config.websocket.port);
        this.initEvents();
        this.io.sockets.on('connection', this.connect);
    },

    initEvents: function(){
        var self=this;
        this.connect = function(socket){
            console.log('ok');
            socket.join('zeroom');
            socket.leave("");
            self.socketList.push(socket);
            socket.emit('news', { hello: hop });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            console.log('created socket ', socket.id);
            socket.emit('content', {"id":socket.id});
            if(self.socketList.length>1){
                self.socketList[0].emit('test', {"onsenfout":"rien de rien", "message":"you were the first but now you are "+self.socketList.length});
            }
            self.io.sockets.in('zeroom').emit('test', {"message": self.socketList.length+" users connected"});
        };
    }
});

var hop;
var theServer = new Server();
theServer.db.db.games.find("", function(err, jeu){
    console.log("2");
    if(err || !jeu){console.log("merdouille");}
    else{
        console.log("Top"+jeu[0].dimension.X[0]+jeu[0].dimension.Y[1]);
        hop="Top"+jeu[0].dimension.X[1]+jeu[0].dimension.Y[0];
    }
});
console.log("3");

/*db.prototype.content = function(){
    return this.find({id:"jeu1"}, function(err, jeu){
        if(err || !jeu){console.log("merdouille");}
        else{
            return jeu[0].dimension.X[0]+jeu[0].dimension.Y[1];
        }
    });
};*/



