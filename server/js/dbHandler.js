/**
 * ClasCol
 * User: loizbek
 * Created by loizbek on 22/10/13.
 * So far only handles mongoDB
 */

var cls = require("./lib/class");
var ObjectId = require('mongojs').ObjectId;

module.exports = DBHandler = cls.Class.extend({
    init: function(config){
        if(config.type == "mongo"){
            var collections=['clasCol', 'players', 'teams', 'actions'];
            this.connectUrl = "mongodb://"+config.user+":"+config.pswd+"@"+config.host+"/"+config.name;
            this.db = require('mongojs').connect(this.connectUrl, collections, this.connectError);
            /**/console.log("1 → db OK");
        }
        else{
            console.error("db type" + config.db.type + " is not handled by the system");
        }

    },

    createUser: function(jsonGameId, aName, aPassword, anEmail, anImage, ioAuthentication_callback){
        var self=this;
        this.db.players.save({name: aName, password: aPassword, email: anEmail, image: anImage },
         {safe:true}, function(err, saved){
        /**/console.log("\033[31msaved", JSON.stringify(err), typeof err, saved);
            if(err || !saved){
                ioAuthentication_callback("Could not create player ("+anEmail+", "+aPassword+").", false);
            }
            else{
                self.auth(jsonGameId, anEmail, aPassword, ioAuthentication_callback);
            }
        });
    },

    auth: function(jsonGameId, email, password, ioAuthentication_callback){
        console.log("\033[36m Auth \033[0m- " , jsonGameId);/**/
        var self = this;
        var query = {"email":email,"password": password};
        var playerNaming = email+", "+password;
        //TODO change query when authenticating from id
        this.db.players.findOne(query, function(err, player){
            if(err || !player){ioAuthentication_callback("Could not find player ("+playerNaming+").", false);}
            else{
                //set up callback sequence
                self.onCreateGameError(function(err, game){
                    ioAuthentication_callback("Could not create a game for "+player._id.toHexString()+".", false);
                });

                    self.onSetPlayerGameError(function(err, thePlayer){
                        ioAuthentication_callback("Could not associate game to "+thePlayer._id.toHexString()+
                            " (consistency of database maybe compromised).", false);
                    });
                    self.onSetPlayerGameSuccess(function(game){
                        ioAuthentication_callback({"player":player._id.toHexString(),
                            "game":game, "team":player.team}, true);
                    });
                self.onCreateGameSuccess(function(err, game){
                    /**/console.log("Set player", err, game);
                    self.setPlayerGame(player._id, jsonGameId, game._id); //depends on the above 2 callbacks
                });
                //the treatment itself
                if(typeof player.team == "undefined"){
                    ioAuthentication_callback(player._id.toHexString()+" ("+playerNaming+
                     ") has no team.", false);
                }
                else if( (typeof player.game == "undefined") ||
                         (typeof player.game.clasCol == "undefined") ||
                         (typeof player.game.clasCol[jsonGameId] == "undefined") ){
                    self.createGame(jsonGameId, player.team);
                }
                else{
                    ioAuthentication_callback(
                        {"player":{"id":player._id.toHexString(), "name":player.name},
                            "team":player.team, "game":player.game.clasCol[jsonGameId]}
                        , true);
                }
            }
        });
    },

    getTeam: function(playerId){
        var self = this;
        this.db.teams.find({"members":{"$elemMatch":{"id": ObjectId("527ef6b3c8b5adde2300000a")/**//*playerId*/}}},
         {"_id":1}, function(err, team){
            if(err || !team){
                self.getTeamError(err, team);
            }
            else{
                self.getTeamSuccess(err, team);
            }
        });
    },
    //no create team it this app it should have been done beforehand

    getGame: function(gameId){
        var self = this;
        this.db.clasCol.findOne({"id":gameId}, function(err, game){
            if(err || !game){
                self.getGameError(err, game);
            }
            else{
                self.getGameSuccess(err, game);
            }
        });
    },

    createGame: function(jsonGameId, teamId){
        var self=this;
        /**/console.log("Create game", jsonGameId, teamId);
        this.db.clasCol.save({"class":jsonGameId, "team":teamId}, function(err, game){
            if(err || !game){
                self.createGameError(err, game);
            }
            else{
                self.createGameSuccess(err, game);
            }
        });
    },

    setPlayerGame: function(playerId, jsonGameId, gameId){
        var self=this;
        var tempField = {};
            tempField[jsonGameId] = gameId ;
        console.log("\033[34mSetPlayer - \033[0m", playerId, jsonGameId, gameId)
        this.db.players.update({"_id":playerId},{ "$set":{"game.clasCol":tempField}}, function(err, nbplayers){
            if(err || (nbplayers !== 1)){
                self.setPlayerGameError(err, nbplayers);
            }
            else{
                console.log("OOOOOOOOk", tempField, playerId);/**/
                self.setPlayerGameSuccess(tempField);
            }
        });
    },

    test: function(){/*
        this.db.clasCol.find({}, function(err, jeu){
            console.log("2");
            if(err || !jeu){console.log("merdouille");}
            else{
                console.log("Top"+jeu[0].dimension.X[0]+jeu[0].dimension.Y[1]);
                hop="Top"+jeu[0].dimension.X[1]+jeu[0].dimension.Y[0];
            }
        });*/
        this.db.players.find({name:'test',password: 'test'}, function(err, player){
            if(err || !player){console.log("merdouille");}
            else{
                console.log(player);
            }
        });
    },

    /***
     * Callbacks
     */
    connectError: function(err, db){
        console.error("Could not connect to db "+this.connectUrl);
    },

    onGetTeamSuccess: function(callback){
        this.getTeamSuccess = callback
    },
    onGetTeamError: function(callback){
        this.getTeamError = callback
    },

    onGetGameSuccess: function(callback){
        this.getTeamSuccess = callback
    },
    onGetGameError: function(callback){
        this.getTeamError = callback
    },

    onCreateGameSuccess: function(callback){
        this.createGameSuccess = callback;
    },
    onCreateGameError: function(callback){
        this.createGameError = callback;
    },

    onSetPlayerGameSuccess: function(callback){
        this.setPlayerGameSuccess = callback;
    },
    onSetPlayerGameError: function(callback){
        this.setPlayerGameError = callback;
    },

});
