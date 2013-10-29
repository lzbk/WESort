/**
 * ClasCol
 * User: loizbek
 * Date: 13/09/13 (14:55)
 * Content: A class to handle "histories"
 */

define(['lib/utils'], function(Util){

    var History=Class.extend({
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
                var found = false;
                for(var i=this.history.length-1; !found && (i>=0); i--){
                    if(this.history[i].author == usr){
                        return this.history[i];
                    }
                }
                return false;
            }
        },

        //prints the last n items  (from user usr)
        print: function(nLast, usr){
            var res="";
            if(typeof nLast === "undefined"){
                nLast = this.history.length;
            }
            for(var i=this.history.length-1; (this.history.length-i<=nLast) && (i>=0); i--){
                if( (typeof usr === "undefined")
                  ||(this.history[i].author === usr)){
                    res += this.history[i].print();
                }
            }
            return res;
        }
    });

    History.Item = Class.extend({
        init: function(usr, time){
            if(typeof time !== "undefined"){
                this.timestamp = new Date(time);
            }
            else{
                this.timestamp = new Date();
            }
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
        },
        print: function(){//to be overloaded
            return this.author+" ("+this.printDate()+")";
        }
    });

    return History;
});