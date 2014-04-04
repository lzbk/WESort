/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the cards, x & y are the ids of the categories in the category class…
 */
// For score handling see git branch "withScore", to be completed…

define(['position', 'history', 'player'], function(Position, History, Player) {

        var CommentItem = History.Item.extend({
            init: function(usr, com, time){
                if(usr != "origin"){
                    usr = usr.getName();
                }
                this._super(usr, time);
                this.comment = com;
            },
            print: function(){
                return Util.print(Patterns.COMMENTITEM,
                    [this.author, this.comment, this.printDate()]);
            }
        });

        var PositionItem = History.Item.extend({
            init: function(usr, pos, time){
                if(usr != "origin"){
                    usr = usr.getName();
                }
                this._super(usr, time);
                this.position = pos;
            },
            print: function(){
                return Util.print(Patterns.POSITIONITEM,
                [this.author, this.position.print(), this.printDate()]);
            }
        });


        var Card = Class.extend({
            init: function(id, name, inverted, categories, img, desc, player){
                //#security
                this.id = id;
                this.name = name;
                if(inverted){
                    this.categories=[categories[1], categories[0]];
                }
                else{
                    this.categories=[categories[0], categories[1]];
                }
                this.img = img;
                this.desc = desc;
                this.opened = false;
                this.positions= new History();
                this.comments= new History();
                this.updatePos("origin");
                this.player = player;
                this.elt = $(this.print());
            },

            //**********************
            // Position Handling
            //**********************
            //updates the position
            updatePos: function(usr,x,y,time){
                this.positions.addItem(new PositionItem(usr, new Position(x,y,time)));
            },
            //gets the position which was assigned by usr or if usr is not provided, the current position
            getPos: function(usr){
                return this.positions.getLastItem(usr).position;
            },

            //gets the same item as getPos and prints it :
            printPos: function(usr){
                return this.positions.getLastItem(usr).print();
            },

            //returns the user who set the card's current position
            getPosAuthorName: function(){
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
                    var found = false;
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
                    comment="no comment";
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
                this.elt.find('.comments').html(this.getCommentValue());
                this.elt.find('.comments').unbind("keydown");
                this.setUpEvents();
            },


            //**********************
            // Rendering
            //**********************
            print: function(){
                return Util.print(Patterns.CARD,
                    [this.id, this.name, this.img, this.desc, this.getCommentValue(), this.positions.print()]);
            },

            spawn: function(){
                if(!this.getPos().inTable()){
                    $('#stack').append(this.elt);
                }
                else{
                   $('#'+this.getPos().getY()+' [data-cat='+this.getPos().getX()+"]").append(this.elt);
                }
                this.setUpEvents();
            },

            open: function(){
                this.elt.attr("open", "open");
                $('#overlay').attr("class", "show");
                this.opened = true;
            },

            close: function(){
                this.elt.removeAttr("open");
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

            setUpEvents: function(){
                var self=this;
                if(typeof this.longClick !== "undefined"){
                    this.longClick.unbind();
                }
                this.longClick = new Util.longClick(this.elt.find('h2'),
                    {action:function(){self.toggleSelection(self.player);}},
                    {action:function(){self.toggleOpenness();}}
                );
                $(this.elt).find('.closeButton').click(function(){self.close();});
                $(this.elt).find('.comments').click(this.prepareSendComment);
            },

            //**********************
            // Actions
            //**********************
            selected: function(){
                return (typeof this.elt.attr("data-selected-by") !== "undefined");
            },

            selectedBy: function(usr){
                if(typeof usr === "undefined"){
                    return this.elt.attr("data-selected-by") ;
                }
                else{
                    return this.elt.attr("data-selected-by") == usr.getId();
                }
            },

            select: function(usr){
                if(!this.selected()){
                    $("[data-selected-by="+usr.getId()+"]").removeAttr("title").removeAttr("data-selected-by");
                    this.elt.attr("data-selected-by", usr.getId()).attr("title", Util.print(Patterns.SELECTED, [usr.getName()]));
                    $("td[data-cat]").addClass("destination");
                    $("menu").addClass("destination");
                }
            },

            unselect: function(usr){
                if(this.selectedBy(usr)){
                    this.elt.removeAttr("data-selected-by").removeAttr("title");
                    $("td[data-cat]").removeClass("destination");
                    $("menu").removeClass("destination");
                }
            },

            toggleSelection: function(usr){//doubles the select test (who cares?)
                if(!this.selected()){
                    this.sendSelect(usr);
                }
                else if(this.selectedBy(usr)){
                    this.sendUnselect(usr);
                }
                else{
                    console.log("can't unselect someone else's selection");
                }
            },

            restoreMoves: function(moves){
                //to move a card during loading
                for(var i=0; i<moves.length ; i++){
                    this.updatePos(new Player(moves[i].player),moves[i].position.X,moves[i].position.Y,moves[i].timestamp);//TODO, les bons champs
                    console.log("après mouvement #", i, "pos :" , this.getPos(), "table?" , this.getPos().inTable());

                    this.elt.find(".position").prepend(this.printPos());
                }
                this.spawn();

            },

            move: function(usr,x,y,time){
                if(this.selectedBy(usr)){
                    this.updatePos(usr,x,y,time);
                    this.unselect();
                    this.elt.find(".position").prepend(this.printPos());
                    this.spawn();
                }
                else{
                    console.log("can't move someone else's selection");
                }
            },

            onSendSelect: function(selectFunction){
                this.sendSelect = selectFunction;
            },

            onSendUnselect: function(unselectFunction){
                this.sendUnselect = unselectFunction;
            },

            forSendingComment: function(sendCommentFunction){
                var self = this;
                this.prepareSendComment = function(){
                    $(this).html(Util.print(Patterns.COMMENTING, [self.getCommentValue(true)]));
                    $(this).unbind("click");
                    $(this).find('#commentInput').focus();
                    $(this).find('#commentInput')[0].selectionStart = 0;
                    $(this).find('#commentInput')[0].selectionEnd = $(this).find('#commentInput').val().length;
                    $(this).keydown(function(e) {
                        var key = e.which,
                            val = $(this).find('#commentInput').val();
                        if(key === 13) {//enter
                            sendCommentFunction(val, self.id);
                        }
                    });
                };
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