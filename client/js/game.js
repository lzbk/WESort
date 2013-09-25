/**
 * ClasCol
 * User: loizbek
 * Date: 20/09/13 (00:45)
 * Content: The game itself, linking cards, table and user
 */
define(['table', 'card', 'category'], function(Table, Card, Category){
    var Game = Class.extend({
        init: function(dataSource, usr){//dataSource, either an object or a string pointing to a directory containing a game_data.json file (no '/' at the end of the path)
            var path="";
            if(typeof dataSource == "string"){
                path = dataSource;
                dataSource = Util.loadJSON(dataSource+"/game_data.json");
            }
            this.user = usr;
            this.id = dataSource.id;//#todo test server before loading
            dataSource.categories.dim.X = new Category(dataSource.categories.dim.X.id, dataSource.categories.dim.X.caption, dataSource.categories.dim.X.explanation);
            dataSource.categories.dim.Y = new Category(dataSource.categories.dim.Y.id, dataSource.categories.dim.Y.caption, dataSource.categories.dim.Y.explanation);
            for(var i=0;i<dataSource.categories.X.length;i++){
                dataSource.categories.X[i] = new Category(dataSource.categories.X[i].id, dataSource.categories.X[i].caption, dataSource.categories.X[i].explanation, dataSource.categories.dim.X.id);
            }
            for(i=0;i<dataSource.categories.Y.length;i++){
                dataSource.categories.Y[i] = new Category(dataSource.categories.Y[i].id, dataSource.categories.Y[i].caption, dataSource.categories.Y[i].explanation, dataSource.categories.dim.Y.id);
            }
            this.board = new Table(dataSource.categories, dataSource.title, dataSource.shuffle);
            this.board.spawn();
            this.cards={};
            for(i=0;i<dataSource.cards.length;i++){
                var img;
                if(Util.isUrl(dataSource.cards[i].img)){
                    img = dataSource.cards[i].img;
                }
                else{
                    img = path + "/" + dataSource.cards[i].img;
                }
                dataSource.cards[i]=(new Card(dataSource.cards[i].id, dataSource.cards[i].name, dataSource.cards[i].cat, img, dataSource.cards[i].desc));
            }
            dataSource.cards.sort(Card.compare); //Allows to sort them before being able to access them directly through their ids (link evt→object through html element id)
            for(i=0;i<dataSource.cards.length;i++){
                this.cards[dataSource.cards[i].id] = dataSource.cards[i];
                this.cards[dataSource.cards[i].id].spawn(this.user);
            }
            $("#help").html(Util.print(Patterns.HELP, [dataSource.help]));
            this.setUpEvents();
        },

        getSelectedCard: function(){
            var id = $("[data-selected-by="+this.user+"]").attr("id");
            if(typeof id=="undefined"){
                return false;
            }
            else{
                return this.cards[id];
            }
        },

        setUpEvents: function(){
            var self = this;
            $('td[data-cat]').click(function(){
                var card = self.getSelectedCard();
                if(card !== false){
                    card.move(self.user, $(this).attr("data-cat"), $(this).parent().attr("id"));
                }
            });
            //As #stack has no "data-cat" attribute, "undefined" will be provided which is what corresponds to setting a neutral position, which is interpreted as #stack by Card.
            //used menu, because stack only extends as far as the last card in the column uncomfortable for a click… #security
            $("menu").click(function(){
                var card = self.getSelectedCard();
                if(card !== false){
                    card.move(self.user);
                }
            });
            $("#helpButton").click(function(){
                $("#help").attr("open", "open");
                $('#overlay').attr("class", "show");
                $("#help .closeButton").click(function(){
                    $("#help").removeAttr("open");
                    $("#overlay").removeAttr("class");
                });
            });
        }
    });
    return Game;
});