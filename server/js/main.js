var config = require('../config.json');
var cls = require('./lib/class');
var dbh = new require('./dbHandler');
var auth = new require('./uglyAuth.socket.io-server');

var Server = cls.Class.extend({
    init: function(){
        this.db = new dbh(config.db);
        this.db.test();
        this.io = require('socket.io').listen(config.websocket.port);
        this.onlinePlayers={};
        this.init_callbacks();
        this.io.sockets.on('connection', this.connect);
    },
    init_callbacks: function(){
        var self=this;
        //connection event
        this.connect = function(socket){
            console.log("Emit connection established with game → ", socket.handshake.query.game);/**/
            socket.emit('connection established', {"player":socket.handshake.query.player,
                "team":socket.handshake.query.team, "online":self.onlinePlayers[socket.handshake.query.game], "game":socket.handshake.query.game});
            //later on add to the emit, the state of the game
            socket.join(socket.handshake.query.game.id);
            socket.leave("");
            socket.on('selectCard', self.selectCard);
            socket.on('unselectCard', self.unselectCard);
            socket.on('moveCard', self.moveCard);
            socket.on('commentCard', self.commentCard);
            socket.on('request validation', self.requestValidation);
            socket.on('cancel validation', self.cancelValidation);
            socket.on('disconnect', function(){
                self.io.sockets.in(this.handshake.query.game.id).emit('leave', {player: this.handshake.query.player});
            });

            self.addOnlinePlayer(socket.handshake.query.player, socket.handshake.query.game);
            self.io.sockets.in(socket.handshake.query.game.id).emit('join', {player: socket.handshake.query.player});
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
            self.db.moveCard(data.gameId, data.cardId, data.usr, data.coords,
                function(){
                    self.io.sockets.in(data.gameId).emit("moveCard", {usr:data.usr, cardId:data.cardId, coords:data.coords});
                }
            );
        };

        //moveCard event
        this.commentCard = function(data){
            self.io.sockets.in(data.gameId).emit("commentCard", {usr:data.usr, cardId:data.cardId, comment: data.comment});
        };

        //requestValidation
        this.requestValidation = function(data){
            self.db.requestValidation(data.usr.id, data.gameId, function(){
                console.log("request vaalidation", data);
                self.io.sockets.in(data.gameId).emit("request validation", {player:data.usr});
                self.db.isToValidate(data.gameId, function(){
                    self.io.sockets.in(data.gameId).emit("validation", {});
                });
            });
        };
        //cancelValidation
        this.cancelValidation = function(data){
            self.db.cancelValidation(data.usr.id, data.gameId, function(){
                self.io.sockets.in(data.gameId).emit("cancel validation", {player:data.usr});
            });
        };

    },

    addOnlinePlayer: function(player, gameId){
        if(typeof this.onlinePlayers[gameId] == "undefined"){
            this.onlinePlayers[gameId] = [];
        }
        if(this.onlinePlayers[gameId].indexOf(player.id) == -1){
            this.onlinePlayers[gameId].push(player.id);
        }
    },
    removeOnlinePlayer: function(player, gameId){
        if( (typeof this.onlinePlayers[gameId] !== "undefined") ){
            var i = this.onlinePlayers[gameId].indexOf(player.id);
            if(i>=0){
                this.onlinePlayers[gameId].splice(i,1);
            }
        }
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



