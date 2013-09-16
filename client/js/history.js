/**
 * ClasCol
 * User: loizbek
 * Date: 13/09/13 (14:55)
 * Content: A class to handle "histories"
 */

define(['lib/utils'], function(Util){

    var History=Class.extend({
        Item:Class.extend({
            init: function(usr){
                this.timestamp = new Date().valueOf();
                this.author = usr;
            },
            getDate: function(){
                return this.timestamp;
            },
            getAuthor: function(){
                return this.author;
            },
            printDate: function(){
                return this.timestamp.toLocaleString();
            }

        }),

        init: function(){
            this.history = [];
        },

        addItem: function(item){
            this.history.push(item);
        },

        //gets the last item from the history or the last Item from usr
        getLastItem: function(usr){
            if(typeof usr === "undefined"){
                return (typeof this.history[this.history.length - 1] !== "undefined") && this.history[this.history.length - 1];
            }
            else{
                for(var i=this.history.length-1; !found && (i>=0); i--){
                    if(this.history[i].author == usr){
                        return this.history[i];
                    }
                }
                return false;
            }
        }
    });

});