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
            var collections=['games'];
            this.connectUrl = "mongodb://"+config.user+":"+config.pswd+"@"+config.host+"/"+config.name;
            this.db = require('mongojs').connect(this.connectUrl, collections, this.connectError);
            /**/console.log("1 → db OK");
        }
        else{
            console.error("db type" + config.db.type + " is not handled by the system");
        }

    },

    connectError: function(err, db){
        console.error("Could not connect to db "+this.connectUrl);
    }

});
