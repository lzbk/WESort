/**
 * WESort
 * User: loizbek
 * Date: 12/11/13
 * minimal player handling
 */

define(function(){
    var Player = Class.extend({
        init: function(idName, name){
            /*example objects : #security
             * {"id":"5280b70293c139540d000001","name":"jeff"}
             */
            if(typeof idName !== "undefined"){
                if(typeof name == "undefined"){
                    this.setId(idName.id);
                    this.setName(idName.name);
                }
                else{
                    this.setId(idName);
                    this.setName(name);
                }
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

        getId: function(){
            return this.id;
        },
        getName: function(){
            return this.name;
        },
        getPlayerOnly: function(){//does not export functions
            return {id: this.id, name: this.name};
        }
    });

    return Player;
});
