/**
 * ClasCol
 * User: loizbek
 * Date: 20/09/13 (00:45)
 * Content: The game itself, linking cards, table and user
 */
define([/*TODO*/], function(){
    var Game = Class.extend({
        init: function(dataSource, usr){
            if(typeof dataSource == "string"){
                dataSource = Util.loadJSON(dataSource);
            }

        },

        setUpEvents: function(){
            var self = this;
            $('td').click(function(){
                var card = self.getSelectedCard();
                if(card !== false){
                    card.move(self.usr, $(this).attr("data-cat"), $(this).parent.attr("id"));
                }
            });
            for(var i=0; i<this.categories.X.length; i++){

            }
            for(i=0; i<this.categories.Y.length; i++){

            }
        }
    });
    return Game;
});