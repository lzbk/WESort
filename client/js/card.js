/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the cards
 */

define(['position', 'history'], function(Position, History) {


        var ScoreItem=History.Item.extend({
            init: function(usr, pos, val){
                this._super(usr);
                this.position = pos;
                this.value = val;
            }
        });

        var PositionItem=History.Item.extend({
            init: function(usr, pos){
                this._super(usr);
                this.position = pos;
            }
        });

        var CommmentItem=History.Item.extend({
            init: function(usr, com){
                this._super(usr);
                this.comment = com;
            }
        });

        var Card = Class.extend({
            positions: new History(), //will condition the rest…
            comments: {},
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
                this.positions.addItem(new PositionItem(usr, new Position(x,y)));
            },
            //gets the position which was assigned by usr or if usr is not provided, the current position
            getPos: function(usr){
                this.positions.getLastItem(usr);
            },
            //returns the user who set the card's current position
            getPosAuthor: function(){
                var lastPos = this.positions.getLastItem();
                return (lastPos !== false) && lastPos.getAuthor;
            },
            //ICITE
            //**********************
            // Score Handling
            //**********************
            setScore: function(usr, val){
                this.scores[this.getPos().asString()][usr.id] = new Score(usr,pos,val);
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
            },

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
            },

            //**********************
            // Comment Handling
            //**********************
            getComment: function(){
                return this.comment;
            },

            setComment: function(aComment){
                this.comment = aComment;
            }

            //**********************
            // Rendering
            //**********************
            render: function(){
                return "<div id='"+this.id+"'>"+this.name+"</div>";
            }

        });
        return Card;
    }
);