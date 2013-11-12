/**
 * ClasCol
 * User: loizbek
 * Date: 11/11/13
 * Storage and state update handled here…
 */

define( function(){
    var Storage = Class.extend({
        gameName : "ClasCol",
        //this game is meant to be used with browserquest, but can "not be"
        init: function(gameId, BQCompatible){
            if((typeof BQCompatible == "boolean") && BQCompatible){
                this.teamField = "guild";
                this.localStorageName = "data";
            }
            else{
                this.teamField = "team";
                this.localStorageName = this.gameName;
            }
            this.gameClass = gameId;
        },

        useable: function(){
            return typeof Modernizr !== "undefined";
        },

        hasLocalStorage: function() {
            return this.useable() && Modernizr.localstorage;
        },

        loadPlayer: function(){
            var retval = false;
            if(this.hasLocalStorage() &&
               (typeof localStorage[this.localStorageName] !== "undefined")) {
                var tmp = JSON.parse(localStorage[this.localStorageName]);
                if(tmp && tmp.player){
                    retval = {
                        name:tmp.player.name,
                         id:tmp.player._id,
                        team:tmp.player[this.teamField],
                      gameId:tmp.player.games[this.gameName][this.gameClass]
                    };
                    if(typeof retval.id == "undefined"){
                        retval = false;
                    }
                }
            }
            return retval;
        },

        savePlayer: function(aPlayer, gameId){
            var tmp = {};
            if(this.hasLocalStorage()){
                if(typeof localStorage[this.localStorageName] !== "undefined") {
                    tmp = JSON.parse(localStorage[this.localStorageName]);
                }
                tmp.player.name = aPlayer.name;
                tmp.player._id  = aPlayer.id;
                tmp.player[this.teamField] = aPlayer.team;
                if(typeof tmp.player.games == "undefined"){
                    tmp.player.games = {};
                }
                if(typeof tmp.player.games[this.gameName]=="undefined"){
                    tmp.player.games[this.gameName]={};
                }
                tmp.player.games[this.gameName][this.gameClass]=gameId;
                localStorage[this.localStorageName] = JSON.stringify(tmp);
            }
        }
    });

    return Storage;
});