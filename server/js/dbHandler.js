/**
 * ClasCol
 * User: loizbek
 * Created by loizbek on 22/10/13.
 * So far only handles mongoDB
 */

//TODO database design is probably terrible… (too "relational" for instance the player collection could contain teams and use new ObjectId() to add users to it…)
//TODO change functions to be able to include the callback #genericity (to reuse those functions)

var cls = require("./lib/class");
var ObjectId = require('mongojs').ObjectId;

module.exports = DBHandler = cls.Class.extend({
    init: function(config){
        if(config.type == "mongo"){
            var collections=['clasCol', 'players', 'teams', 'actions'];
            this.connectUrl = "mongodb://"+config.user+":"+config.pswd+"@"+config.host+"/"+config.name;
            this.db = require('mongojs').connect(this.connectUrl, collections, this.connectError);
            /*this.setPlayerTeam(new ObjectId("52d306d413e7de8910000001"), "Gérard", new ObjectId("5287f3e2276941ceebade1e3"), "guild1");
            this.setPlayerTeam(new ObjectId("5287b70c93b4573f10000001"), "test1", new ObjectId("5287f3e2276941ceebade1e3"), "guild1");
            this.setPlayerTeam(new ObjectId("5287b72293b4573f10000002"), "test2", new ObjectId("5287f3e2276941ceebade1e3"), "guild1");
            this.setPlayerTeam(new ObjectId("5287b74093b4573f10000003"), "test3", new ObjectId("5287f62c276941ceebade1e4"), "guild2");
            this.setPlayerTeam(new ObjectId("5287b76593b4573f10000004"), "test4", new ObjectId("5287f62c276941ceebade1e4"), "guild2");*/
        }
        else{
            console.error("db type" + config.db.type + " is not handled by the system");
        }

    },

    createUser: function(jsonGameId, aName, aPassword, anEmail, anImage, ioAuthentication_callback){
        var self=this;
        this.db.players.save({name: aName, password: aPassword, email: anEmail, image: anImage },
         {safe:true}, function(err, saved){
            if(err || !saved){
                ioAuthentication_callback("Could not create player ("+anEmail+", "+aPassword+").", false);
            }
            else{
                self.auth(jsonGameId, anEmail, aPassword, ioAuthentication_callback);
            }
        });
    },

    /*Does everything, it authentifies and depending on the case (succesfully authentified or not, first connection to this game or not, team already having launched a game or not, etc) calls the appropriate methods to update the state of the DB*/
    auth: function(jsonGameId, email, password, ioAuthentication_callback){
        var self = this;
        if(typeof password == "function"){
            //it's calling auth using the user id (stored in the e-mail variable, though)
            ioAuthentication_callback = password;
            var query = {"_id":new ObjectId(email)};
            var playerNaming = "Id: "+email ;
        }
        else{
            var query = {"email":email,"password": password};
            var playerNaming = email+", "+password;
        }
        this.db.players.findOne(query, function(err, player){
            if(err || !player){ioAuthentication_callback("Could not find player ("+playerNaming+").", false);}
            else{
                //set up callback sequence
                //***maybe*** using dbrefs or something would allow to store teams in the players documents and limit
                //use of manual references and callbacks TODO
                //see http://docs.mongodb.org/manual/reference/database-references/

                self.onGetGameError(function(err, game, gameId){
                    ioAuthentication_callback("Could not find a game with id "+gameId+".", false);
                });

                self.onGetGameSuccess(function(game){
                    ioAuthentication_callback({
                        "player":{"id":player._id.toHexString(), "name":player.name},
                        "game":  {"id": game._id, "validationRequests": game.validationRequests, "state": game.cards}
                    }, true);//TODO ICITE je dois tester si objet == {a:{e:f}} et objet["a.b"] = c → objet=={a:{b:c, e:f}}, ensuite il faut ajouter l'état des validations puis traiter le côté client qui déjà n'a pas le champ id pour game dans les données reçues…
                });


                self.onCreateGameError(function(err, game){
                    ioAuthentication_callback("Could not create a game for "+player._id.toHexString()+".", false);
                });

                    self.onSetTeamGameError(function(err){
                        ioAuthentication_callback("Could not associate game to "+player.team.id.toHexString()+
                            " members (consistency of database maybe compromised).", false);
                    });

                    self.onSetTeamGameSuccess(function(gameId){
                        ioAuthentication_callback({"player":{"id":player._id.toHexString(), "name":player.name},
                            "game":{"id":gameId}});
                        self.getGame(gameId);
                    });
                self.onCreateGameSuccess(function(err, game){
                    self.setTeamGame(player.team.id, jsonGameId, game._id); //depends on the above 2 callbacks
                });
                self.onGetTeamError(function(err, theTeam){
                    ioAuthentication_callback("Could not retrieve "+player._id.toHexString()+
                        "'s team ("+player.team.id+").", false);
                });
                self.onGetTeamSuccess(function(err, theTeam){
                    ioAuthentication_callback({"team":theTeam});
                    if( (typeof player.games == "undefined") ||
                        (typeof player.games.clasCol == "undefined") ||
                        (typeof player.games.clasCol[jsonGameId] == "undefined") ){
                        self.createGame(jsonGameId, theTeam);
                    }
                    else{
                        ioAuthentication_callback(
                            {"player":{"id":player._id.toHexString(), "name":player.name},
                             "game":{"id":player.games.clasCol[jsonGameId].id}});
                        self.getGame(player.games.clasCol[jsonGameId].id);
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
        if(typeof gameId === "string"){
            gameId = new ObjectId(gameId);
        }
        this.db.clasCol.findOne({"_id":gameId}, function(err, game){
            if(err || !game){
                /**/console.log('db.clasCol.findOne({"id":'+gameId+'})');
                self.getGameError(err, game, gameId);
            }
            else{
                /**/console.log(game);
                self.getGameSuccess(game);
            }
        });
    },

    createGame: function(jsonGameId, aTeam){
        var self=this, validationRequests = {true:[], false:[]};
        aTeam.members.forEach(function(item){
           validationRequests["false"].push(Object.keys(item)[0]);
        });
        console.log("createGame", validationRequests);
        this.db.clasCol.save({"class":jsonGameId, "team":aTeam._id, "validationRequests":validationRequests}, function(err, game){
            if(err || !game){
                self.createGameError(err, game);
            }
            else{

                self.createGameSuccess(err, game);
            }
        });
    },

    //associate game (jsonGameId → the class of the game; gameId its id in the collection)
    //to each player documents of the team (teamId)
    setTeamGame: function(teamId, jsonGameId, gameId){
        var self=this;
        var tempField = {};
            tempField["games.clasCol."+jsonGameId+".id"] = gameId ;
        console.log("\033[34mSetPlayer - \033[0m", teamId, jsonGameId, gameId)
        this.db.players.update({"team.id":teamId},{"$set":tempField}, {multi:true}, function(err, nbplayers){
            if(err || (nbplayers == 0)){
                self.setTeamGameError(err, nbplayers);
            }
            else{
                self.setTeamGameSuccess(gameId.toHexString());
            }
        });
    },

    setPlayerTeam: function(playerId, playerName, teamId, teamName){
        //for administrative support at this point
        //?this.onSetPlayerGameError(function(err, nb){console.log(err, nb);});
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

    requestValidation: function(playerId, gameId, callback){
        //#security, what if undefined ?, what if wrongly called, no  background check pulls all values though
        if(typeof playerId !== "string"){
            playerId = playerId.toHexString();
        }
        if(typeof gameId == "string"){
            gameId = new ObjectId(gameId);
        }
        var query = {"$pull":{"validationRequests.false":playerId}, "$push":{"validationRequests.true":playerId}};
        console.log('db.clasCol.update({"_id":',gameId,'}, ',query,')');/**/
        this.db.clasCol.update({"_id":gameId}, query, function(err, nbgames){
            if(err || (nbgames !== 1)){
                console.log(err, nbgames, "could not request validation for player "+playerId);
            }
            else{
                callback();
            }
        });
    },
    cancelValidation: function(playerId, gameId, callback){
        //#security, what if undefined ?, what if wrongly called, no  background check pulls all values though
        if(typeof playerId !== "string"){
            playerId = playerId.toHexString();
        }
        if(typeof gameId == "string"){
            gameId = new ObjectId(gameId);
        }
        var query = {"$push":{"validationRequests.false":playerId}, "$pull":{"validationRequests.true":playerId}};
        console.log('db.clasCol.update({"_id":'+gameId+'}, '+query+')');/**/
        this.db.clasCol.update({"_id":gameId}, query, function(err, nbgames){
            if(err || (nbgames !== 1)){
                console.log(err, nbgames, "could not cancel validation for player "+playerId);
            }
            else{
                callback();
            }
        });
    },
    isToValidate: function(gameId, validate_callback){
        if(typeof gameId == "string"){
            gameId = new ObjectId(gameId);
        }
        this.db.clasCol.findOne({"_id" : gameId, "validationRequests.false":{"$size":0}}, {"_id":1}, function(err, game){
            if(err){
                console.log(err, "error in isToValidate");
            }
            else{
                console.log("\033[34misToValidate? - \033[0m",game);
                if(game !== null){ //if the query yields no result the validation is on…
                    validate_callback();
                }
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

    //#todo: 1 day it would be nice to replace the author name by something linked to their id
    storeComment: function(gameId, cardId, author, content, callback){

    },

    moveCard: function(gameId, cardId, author, position, callback){
        if(typeof gameId == "string"){
            gameId = new ObjectId(gameId);
        }
        var self=this, pushQuery={};
        pushQuery["cards."+cardId+".lastPositions"]= {$each:
            [{"player":author, "position":position, "timestamp":new Date()}],
            $slice: -5
        };
        this.db.clasCol.update({ "_id" : gameId}, {$push:pushQuery},
            function(err, nbgames){
            if(err || (nbgames !== 1)){//#todo check 1 is OK
                self.moveCardError(err, nbgames);
            }
            else{
                callback();
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

    onSetTeamGameSuccess: function(callback){
        this.setTeamGameSuccess = callback;
    },
    onSetTeamGameError: function(callback){
        this.setTeamGameError = callback;
    },

    onSetPlayerTeamError: function(callback){
        this.setPlayerTeamError = callback;
    },
    onSetPlayerTeamSuccess: function(callback){
        this.setPlayerTeamSuccess = callback;
    },

    moveCardError: function(err, count){
        console.log("moveCard yielded an error → ", err, "("+count+")");
    }
});
