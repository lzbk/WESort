/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the cards
 */

define(['position'], function(Position) {
        var HistoryPoint=Class.extend({
           init: function(usr, pos){
               this.timestamp = new Date().valueOf();
               this.author = usr;
               this.position = pos;
           }
        });

        var Score=Class.extend({
            init: function(usr, pos, val){
                this.author = usr;
                this.position = pos;
                this.value = val;
            },
            updateValue: function(val){
                this.value = val;
            }
        });

        var Card = Class.extend({
            comment: "",
            posHistory: [],
            scores: {},
            init: function(id, name, categories, img, desc){
                //TODO : type tests one day?
                this.id = id;
                this.name = name;
                this.categories = categories;
                this.img = img;
                this.desc = desc;
            },

            //**********************
            // Position Handling
            //**********************
            //updates the position
            updatePos: function(usr,x,y){
                this.posHistory.push(new HistoryPoint(usr, new Position(x,y)));
            },
            //gets the position which was assigned by usr or if usr is not provided, the current position
            getPos: function(usr){
                if(typeof usr === "undefined"){
                    return (typeof this.posHistory[this.posHistory.length - 1] !== "undefined") && this.posHistory[this.posHistory.length - 1].position;
                }
                else{
                    for(var i=this.posHistory.length-1; !found && (i>=0); i--){
                        if(this.posHistory[i].author == usr){
                            return this.posHistory[i].position;
                        }
                    }
                    return false;
                }
            },
            //returns the user who set the card's current position
            getPosAuthor: function(){
                return (typeof this.posHistory[this.posHistory.length - 1] !== "undefined") && this.posHistory[this.posHistory.length - 1].author;
            },

            //**********************
            // Score Handling
            //**********************
            setScore: function(usr){
                this.scores[this.getPos().asString()][usr.id] = new Score();
            },
            getPosScore: function(pos, usr){
                if(typeof pos === "undefined"){
                    pos = this.getPos().asString();
                }
                else{
                    pos = pos.asString();
                }
                var res = 0;
                if(typeof usr === "undefined"){
                    for(var i in this.scores[pos]){
                        res = res + this.scores[pos][i].value ;
                    }
                    //this.scores[pos].forEach(function(element){res = res + element.value});
                }
                else{
                    res = this.scores[pos][usr.id];
                }
                return res;
            }

            //**********************
            // Result Handling
            //**********************
            /*Returns the array of categories or a boolean saying whether cat is one of the categories associated to the card*/
            // no setter, the categories should not be changed after initialization + the vars are not protected
            getCategories: function(cat){
                if (typeof cat === "undefined"){
                    return this.categories;
                }
                else{
                    var found = false
                    for(var i=0; !found && i<this.categories.length; i++){
                        found = (this.categories[i] == cat);
                    }
                    return found;
                }
            },

            //returns true if the card is well positioned
            evaluate: function(){
                return this.getPos().compare(this.categories);
            }

        });
        return Card;
    }
);