var config = require('../config.json');
var cls = require('./lib/class');
var dbh = new require('./dbHandler');
var auth = new require('./uglyAuth.socket.io-server');

var Server = cls.Class.extend({
    init: function(){
        this.db = new dbh(config.db);
        this.db.test();
        this.io = require('socket.io').listen(config.websocket.port);

        this.init_callbacks();
        this.io.sockets.on('connection', this.connect);
    },



    init_callbacks: function(){
        var self=this;
        //connection event
        this.connect = function(socket){
            socket.emit('connection established', {"player":socket.handshake.query.player,
                "team":socket.handshake.query.team, "game":socket.handshake.query.game});
            //later on add to the emit, the state of the game
            socket.join(socket.handshake.query.game);
            socket.leave("");
            socket.on('selectCard', self.selectCard);
            socket.on('unselectCard', self.unselectCard);
            socket.on('moveCard', self.moveCard);
            socket.on('commentCard', self.commentCard);
            self.io.sockets.in(socket.handshake.query.game).emit('join', {message: socket.handshake.query.player.name+" vient de se connecter"});
        };

        //selectCard event
        this.selectCard = function(data){
            console.log("select card", data);
            self.io.sockets.in(data.gameId).emit("selectCard", {usr:data.usr, cardId:data.cardId});
        };

        //unselectCard event
        this.unselectCard = function(data){
            self.io.sockets.in(data.gameId).emit("unselectCard", {usr:data.usr, cardId:data.cardId});
        };

        //moveCard event
        this.moveCard = function(data){
            self.io.sockets.in(data.gameId).emit("moveCard", {usr:data.usr, cardId:data.cardId, coords:data.coords});
        };

        //moveCard event
        this.commentCard = function(data){
            self.io.sockets.in(data.gameId).emit("commentCard", {usr:data.usr, cardId:data.cardId, comment: data.comment});
        };
    }
});

var theServer = new Server();
auth(theServer.io, theServer.db); //create authentication handlers
console.log("3");

/*db.prototype.content = function(){
    return this.find({id:"jeu1"}, function(err, jeu){
        if(err || !jeu){console.log("merdouille");}
        else{
            return jeu[0].dimension.X[0]+jeu[0].dimension.Y[1];
        }
    });
};*/



