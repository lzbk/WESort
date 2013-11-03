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
        this.db.players.save({name: aName, password: aPassword, email: anEmail, image: anImage });
    },

    test: function(){/**/
        this.db.clasCol.find("", function(err, jeu){
            console.log("2");
            if(err || !jeu){console.log("merdouille");}
            else{
                console.log("Top"+jeu[0].dimension.X[0]+jeu[0].dimension.Y[1]);/**/
                hop="Top"+jeu[0].dimension.X[1]+jeu[0].dimension.Y[0];
            }
        });
    },

    connectError: function(err, db){
        console.error("Could not connect to db "+this.connectUrl);
    }

});
