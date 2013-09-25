/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the cards, x & y are the ids of the categories in the category class…
 */
// For score handling see git branch "withScore", to be completed…

define(['position', 'history'], function(Position, History) {

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
                //#security
                this.id = id;
                this.name = name;
                this.categories = categories;
                this.img = img;
                this.desc = desc;
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
                return this.positions.getLastItem(usr).position;
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
            //if justContent, do not call print…
            getCommentValue: function(justContent){
                var comment = this.getComment();
                if(!comment){
                    comment="no comments";
                }
                else{
                    if((typeof justContent !== "undefined") && justContent){
                        comment=comment.comment;
                    }
                    else{
                        comment=comment.print();
                    }
                }
                return comment;
            },

            setComment: function(usr, textForAComment){
                this.comments.addItem(new CommentItem(usr, textForAComment));
            },

            //**********************
            // Rendering
            //**********************
            print: function(){
                return Util.print(Patterns.CARD,
                    [this.id, this.name, this.img, this.desc, this.getCommentValue(), this.positions.print()]);
            },

            spawn: function(usr){
                if(!this.getPos().inTable()){
                    $('#stack').append(this.print());
                }
                else{
                   $('#'+this.getPos().getY()+' [data-cat='+this.getPos().getX()+"]").append(this.print());
                }
                this.setUpEvents(usr);
            },

            open: function(){
                $('#'+this.id).attr("open", "open");
                $('#overlay').attr("class", "show");
                this.opened = true;
            },

            close: function(){
                $('#'+this.id).removeAttr("open");
                $('#overlay').removeAttr("class");
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

            setUpEvents: function(usr){
                var self=this;
                delete this.longClick;
                this.longClick = new Util.longClick('#'+self.id+' h2',
                    {action:function(){self.toggleSelection(usr);}},
                    {action:function(){self.toggleOpenness();}}
                );
                $('#'+this.id+' .closeButton').click(function(){self.close();});
                $('#'+this.id+' .comments').click(function(){
                    $(this).html(Util.print(Patterns.COMMENTING, [self.getCommentValue(true)]));
                    $(this).unbind("click");
                    $('#commentInput').focus();
                    $('#commentInput')[0].selectionStart = 0;
                    $('#commentInput')[0].selectionEnd = $('#commentInput').val().length;
                    $(this).keydown(function(e) {
                        var key = e.which,
                            val = $('#commentInput').val();
                        if(key === 13) {//enter
                            self.setComment(usr, val);
                            $(this).html(self.getCommentValue());
                            self.setUpEvents(usr);
                            $(this).unbind("keydown");
                        }
                    });
                });
            },

            //**********************
            // Actions
            //**********************
            selected: function(){
                return (typeof $('#'+this.id).attr("data-selected-by") !== "undefined");
            },

            selectedBy: function(usr){
                if(typeof usr === "undefined"){
                    return $('#'+this.id).attr("data-selected-by") ;
                }
                else{
                    return $('#'+this.id).attr("data-selected-by") == usr ;
                }
            },

            select: function(usr){
                if(!this.selected()){
                    $("[data-selected-by="+usr+"]").removeAttr("data-selected-by");
                    $('#'+this.id).attr("data-selected-by", usr);
                }
            },

            unselect: function(usr){
                if(this.selectedBy(usr)){
                    $('#'+this.id).removeAttr("data-selected-by");
                }
            },

            toggleSelection: function(usr){
                if(!this.selected()){ //doubles the select test (who cares?)
                    this.select(usr);
                }
                else{
                    this.unselect(usr); //will unselect only if selected by usr
                }
            },

            move: function(usr,x,y){
                if(this.selectedBy(usr)){
                    this.updatePos(usr,x,y);
                    this.unselect();
                    $('#' + this.id).remove();
                    this.spawn(usr);
                }
            }



        });

        Card.compare = function(a,b){
            var res;
            if(a.name< b.name){
                res = -1;
            }
            else if(a.name== b.name){
                res = 0;
            }
            else{
                res = 1;
            }
            return res;
        };

        return Card;
    }
);