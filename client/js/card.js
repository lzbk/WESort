/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the cards, x & y are the ids of the categories in the category class…
 */
// For score handling see git branch "withScore", to be completed…

define(['lib/utils','position', 'history'], function(Util, Position, History) {

        var CommentItem = History.Item.extend({
            init: function(usr, com){
                this._super(usr);
                this.comment = com;
            },
            print: function(){
                return Util.print(Patterns.COMMENTITEM,
                    [this.author, this.comment, this.printDate()]);
            }
        });

        var PositionItem = History.Item.extend({
            init: function(usr, pos){
                this._super(usr);
                this.position = pos;
            },
            print: function(){
                return Util.print(Patterns.POSITIONITEM,
                [this.author, this.position.print(), this.printDate()]);
            }
        });


        var Card = Class.extend({
            init: function(id, name, categories, img, desc){
                //#types
                this.id = id;
                this.name = name;
                this.categories = categories;
                this.img = img;
                this.desc = desc;
                this.selectedBy = false;
                this.opened = false;
                this.positions= new History(),
                this.comments= new History(),
                this.updatePos("origin");
                this.print();
            },

            //**********************
            // Position Handling
            //**********************
            //updates the position
            updatePos: function(usr,x,y){
                //var self = this;
                this.positions.addItem(new PositionItem(usr, new Position(x,y)));
            },
            //gets the position which was assigned by usr or if usr is not provided, the current position
            getPos: function(usr){
                return this.positions.getLastItem(usr);
            },
            //returns the user who set the card's current position
            getPosAuthor: function(){
                var lastPos = this.positions.getLastItem();
                return (lastPos !== false) && lastPos.getAuthor();
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
            getComment: function(usr){
                return this.comments.getLastItem(usr);
            },

            setComment: function(usr, textForAComment){
                this.comments.addItem(new CommentItem(usr, textForAComment));
            },

            //**********************
            // Rendering
            //**********************
            print: function(){
                var comment = this.getComment();
                if(!comment){
                    comment="no comments";
                }
                else{
                     comment=comment.print();
                }
                return Util.print(Patterns.CARD,
                    [this.id, this.name, this.img, this.desc, comment, this.positions.print()]);
            },

            spawn: function(father){
                $(father).append(this.print());
                this.setUpEvents();
            },

            open: function(){
                $('#'+this.id).attr("open", "open");
                this.opened = true;
            },

            close: function(){
                $('#'+this.id).removeAttr("open");
                this.opened = false;
            },

            toggleOpenness: function(){
                if(this.opened===false){
                    this.open();
                }
                else{
                    this.close();
                }
            },

            setUpEvents: function(){
                var self=this;
                new Util.longClick('#'+self.id,
                    {action:function(){self.toggleSelection();}},
                    {action:function(data){self.toggleOpenness();window.alert(data);},
                     data: self.desc}
                );
            },

            //**********************
            // Actions
            //**********************
            select: function(usr){
                $('#'+this.id).addClass("selected");
                this.selectedBy = usr;
            },

            unselect: function(){
                $('#'+this.id).removeClass("selected");
                this.selectedBy = false;
            },

            toggleSelection: function(){
                if(this.selectedBy===false){
                    this.select();
                }
                else{
                    this.unselect();
                }
            },

            move: function(usr,x,y){
                if(usr === this.selectedBy){
                    this.updatePos(usr,x,y);
                    this.unselect();
                    this.print();
                }
            }



        });
        return Card;
    }
);