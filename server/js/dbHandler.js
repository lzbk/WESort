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
            /*this.setPlayerTeam(new  ObjectId("528415e6293af74b0d000001"), "mathieu", new ObjectId("52801a8ba3c0d51d6af8dd41"), "guild1");
            this.setPlayerTeam(new ObjectId("528416956a1fac090e000001"), "test", new ObjectId("52801a8ba3c0d51d6af8dd41"), "guild1");
            this.setPlayerTeam(new ObjectId("528416ffb62f9b220e000001"), "test2", new ObjectId("52841555c797188f959c62cc"), "guild2");
            this.setPlayerTeam(new ObjectId("5284177c0ff41e340e000001"), "test3", new ObjectId("52841555c797188f959c62cc"), "guild2");*/
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
        if(typeof password == "function"){
            //it's calling auth using the user id
            ioAuthentication_callback = password;
            var query = {"_id":new ObjectId(email)};
            var playerNaming = "Id: "+email ;
        }
        else{
            var query = {"email":email,"password": password};
            var playerNaming = email+", "+password;
        }
        //TODO change query when authenticating from id
        this.db.players.findOne(query, function(err, player){
            console.log(query, err, player);/**/
            if(err || !player){ioAuthentication_callback("Could not find player ("+playerNaming+").", false);}
            else{
                //set up callback sequence
                //***maybe*** using dbrefs or something would allow to store teams in the players documents and limit
                //use of manual references and callbacks TODO
                //see http://docs.mongodb.org/manual/reference/database-references/
                self.onCreateGameError(function(err, game){
                    ioAuthentication_callback("Could not create a game for "+player._id.toHexString()+".", false);
                });

                    self.onSetPlayerGameError(function(err, thePlayer){
                        ioAuthentication_callback("Could not associate game to "+thePlayer._id.toHexString()+
                            " (consistency of database maybe compromised).", false);
                    });

                    self.onSetPlayerGameSuccess(function(game){
                        ioAuthentication_callback({"player":{"id":player._id.toHexString(), "name":player.name},
                            "game":game}, true);
                    });
                self.onCreateGameSuccess(function(err, game){
                    self.setPlayerGame(player._id, jsonGameId, game._id); //depends on the above 2 callbacks
                });
                self.onGetTeamError(function(err, theTeam){
                    ioAuthentication_callback("Could not retrieve "+player._id.toHexString()+
                        "'s team ("+player.team.id+").", false);
                });
                self.onGetTeamSuccess(function(err, theTeam){
                    console.log("\033[1m\033[31mTeam\033[0m → ",{"team":{"id":theTeam._id.toHexString(), "name":theTeam.name, "members":theTeam.members}});/**/
                    ioAuthentication_callback({"team":theTeam});
                    if( (typeof player.games == "undefined") ||
                        (typeof player.games.clasCol == "undefined") ||
                        (typeof player.games.clasCol[jsonGameId] == "undefined") ){
                        self.createGame(jsonGameId, player.team);
                    }
                    else{
                        ioAuthentication_callback(
                            {"player":{"id":player._id.toHexString(), "name":player.name}, "game":player.games.clasCol[jsonGameId]}
                            , true);
                    }
                });
                //the treatment itself
                if(typeof player.team == "undefined"){
                    ioAuthentication_callback(player._id.toHexString()+" ("+playerNaming+
                     ") has no team.", false);
                }
                else{
                    self.getTeam(player._id);
                }
            }
        });
    },

    getTeam: function(playerId){
        var self = this;
        var exists = {};
        exists[playerId.toHexString()] = {"$exists": true};
        this.db.teams.findOne({"members":{"$elemMatch":exists}},
         function(err, team){
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
        this.db.players.update({"_id":playerId},{ "$set":{"games.clasCol":tempField}}, function(err, nbplayers){
            if(err || (nbplayers !== 1)){
                self.setPlayerGameError(err, nbplayers);
            }
            else{
                self.setPlayerGameSuccess(tempField);
            }
        });
    },

    setPlayerTeam: function(playerId, playerName, teamId, teamName){
        //for administrative support at this point
        this.onSetPlayerGameError(function(err, nb){console.log(err, nb);});
        this.onSetPlayerTeamSuccess(function(){console.log("Player added to team");});
        var self = this;
        this.db.players.update({"_id":playerId},{ "$set":{"team":{"id":teamId, "name":teamName}}}, function(err, nbplayers){
            if(err || (nbplayers !== 1)){
                self.setPlayerTeamError(err, nbplayers);
            }
            else{
                var tmpPlayer = {};
                tmpPlayer[playerId] = playerName;
                self.db.teams.update({"_id":teamId}, {"$push":{"members":tmpPlayer}},  function(err, nbteams){
                    if(err || (nbteams !== 1)){
                        self.setPlayerTeamError(err, nbteams);
                    }
                    else{
                        self.setPlayerTeamSuccess();
                    }
                });
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
        this.getGameSuccess = callback
    },
    onGetGameError: function(callback){
        this.getGameError = callback
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

    onSetPlayerTeamError: function(callback){
        this.setPlayerTeamError = callback;
    },
    onSetPlayerTeamSuccess: function(callback){
        this.setPlayerTeamSuccess = callback;
    }
});
