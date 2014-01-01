/**
 * Created by loizbek on 01/01/14.
 */
//to list all the users who requested a validation
requestedValidations: function(gameId, callback){
    if(typeof gameId == "string"){
        gameId = new ObjectId(gameId);
    }
    var query = {};
    query["games.clasCol."+jsonGameId+".id"] = gameId;
    query["games.clasCol."+jsonGameId+".requestedValidation"]={"$nin":[true]};
    this.db.players.find(query, {"_id":1}).forEach(function(err, player){
        if(err || !player){
            console.log(err, "error in requestedValidations");
        }
        else{
            console.log("\033[34mrequestedValidations - \033[0m",player, query);
            callback(player);
        }
    });
},