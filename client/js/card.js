/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the cards, x & y are the ids of the categories in the category class…
 */
// For score handling see git branch "withScore", to be completed…

define(['position', 'history'], function(Position, History) {

        var PositionItem=History.Item.extend({
            init: function(usr, pos){
                this._super(usr);
                this.position = pos;
            },
            print: function(){
                return Util.print("<span class='date'>{2}</span> {0} ({1})",
                [this.usr, this.position.print(), this.printDate()]);
            }
        });

        var CommmentItem=History.Item.extend({
            init: function(usr, com){
                this._super(usr);
                this.comment = com;
            },
            print: function(){
                return Util.print("{0}: {1} <span class='date'>{2}</span>",
                    [this.usr, this.comment, this.printDate()];
            }
        });

        var Card = Class.extend({
            positions: new History(),
            comments: new History(),
            init: function(id, name, categories, img, desc){
                //TODO : type tests one day?
                this.id = id;
                this.name = name;
                this.categories = categories;
                this.img = img;
                this.desc = desc;
                this.print();
                this.selectedBy = false;
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

                return Util.print("<details id='{0}'><summary>{1}<span>&nbsp;</span></summary>
                <img src='{2}' />
                    <p>{3}</p>
                    <footer>
                        <p class='comments'>{4}</p>
                        <p class='position'>{5}</p>
                    </footer>
                </div>",[this.id, this.name, this.img, this.description, this.getComment(), ]);
            },

            open: function(){
                $('#'+this.id).addClass("zoomedInOn");
            },

            close: function(){
                $('#'+this.id).removeClass("zoomedInOn");
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