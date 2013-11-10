var config = require('../config.json');
var cls = require('./lib/class');
var dbh = new require('./dbHandler');
var auth = new require('./uglyAuth.socket.io-server');

var Server = cls.Class.extend({
    init: function(){
        this.socketList = [];
        this.tst=[];
        this.db = new dbh(config.db);
        this.db.test();
        this.io = require('socket.io').listen(config.websocket.port);

        this.init_callbacks();
        this.auth = new auth(this.io, this.db);
        this.io.sockets.on('connection', this.connect);
    },



    init_callbacks: function(){
        var self=this;
        this.connect = function(socket){
            socket.join('zeroom');
            socket.leave("");
            self.socketList.push(socket);
            socket.emit('news', { hello: hop });
            socket.on('my other event', function (data) {
                console.log(data);
            });
            console.info('\033[35mcreated socket \033[0m', socket.id);
            console.log("\033[31m",socket.handshake);
            socket.emit('content', {"id":socket.id, "hsd":socket.handshake});
            if(self.socketList.length>1){
                self.socketList[0].emit('test', {"onsenfout":"rien de rien", "message":"you were the first but now you are "+self.socketList.length});
            }
            self.io.sockets.in('zeroom').emit('test', {"message": self.socketList.length+" users connected"});
        };
    }
});

var hop;
var theServer = new Server();
console.log("3");

/*db.prototype.content = function(){
    return this.find({id:"jeu1"}, function(err, jeu){
        if(err || !jeu){console.log("merdouille");}
        else{
            return jeu[0].dimension.X[0]+jeu[0].dimension.Y[1];
        }
    });
};*/



