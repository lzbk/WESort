/**
 * ClasCol
 * User: loizbek
 * Date: 12/11/13
 * minimal player handling
 */

define(function(){
    var Player = Class.extend({
        init: function(idName, teamIdName){
            //example objects : #security
            // {"id":"5280b70293c139540d000001","name":"jeff"}
            // {"id":"52801a8ba3c0d51d6af8dd41","name":"guildblum"}
            if(typeof idName !== "undefined"){
                this.setId(idName.id);
                this.setName(idName.name);
                this.setTeam(teamIdName);
            }
        },

        isEmpty: function(){
            return (typeof this.id == "undefined");
        },

        setId: function(id){
            this.id = id;
        },
        setName: function(name){
            this.name = name;
        },
        setTeam: function(team){
            this.team = {};
            this.team.id = team.id;
            this.team.name = team.name;
        },

        getId: function(){
            return this.id;
        },
        getName: function(){
            return this.name;
        },
        getTeamId: function(){
            return this.team.id;
        },
        getTeamName: function(){
            return this.team.name;
        }

    });

    return Player;
});
