/**
 * ClasCol
 * User: loizbek
 * Created by loizbek on 22/10/13.
 * So far only handles mongoDB
 */

var cls = require("./lib/class");

module.exports = DBHandler = cls.Class.extend({
    init: function(config){
        if(config.type == "mongo"){
            var collections=['clasCol', 'players'];
            this.connectUrl = "mongodb://"+config.user+":"+config.pswd+"@"+config.host+"/"+config.name;
            this.db = require('mongojs').connect(this.connectUrl, collections, this.connectError);
            /**/console.log("1 → db OK");
        }
        else{
            console.error("db type" + config.db.type + " is not handled by the system");
        }

    },

    createUser: function(aName, aPassword, anEmail, anImage, ioAuthentication_callback){
        var self=this;
        this.db.players.save({name: aName, password: aPassword, email: anEmail, image: anImage }, {safe:true}, function(err, saved){
        /**/console.log("\033[31msaved", JSON.stringify(err), typeof err, saved);
            if(err || !saved){
                ioAuthentication_callback("Could not create player ("+anEmail+", "+aPassword+").", false);
            }
            else{self.auth(anEmail, aPassword, ioAuthentication_callback);}
        });
    },

    auth: function(email, password, ioAuthentication_callback){
        console.log("\033[36m Auth");/**/
        this.db.players.findOne({"email":email,"password": password}, function(err, player){
            if(err || !player){ioAuthentication_callback("Could not find player ("+email+", "+password+").", false);}
            else{
                ioAuthentication_callback({"player":player._id.toHexString(),"game":player.game, "team":player.team}, true);
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

    connectError: function(err, db){
        console.error("Could not connect to db "+this.connectUrl);
    }

});
