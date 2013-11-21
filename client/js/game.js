/**
 * ClasCol
 * User: loizbek
 * Date: 20/09/13 (00:45)
 * Content: The game itself, linking cards, table and user
 */
define(['table', 'card', 'category', 'storage', 'player', 'uglyAuth.socket.io-client'],
        function(Table, Card, Category, Storage, Player, UglyAuth_io){
    var Game = Class.extend({
        init: function(dataSourceBoard, dataSourceConfig){//dataSource, either an object or a string pointing to a directory containing a game_data.json file (no '/' at the end of the path)
            this.storage = new Storage(this.class, true);
            var tmpPlayer = this.storage.loadPlayer();
            if (tmpPlayer !== false){
                this.player = new Player({id:tmpPlayer.id, name: tmpPlayer.name},
                    tmpPlayer.team);
            }
            else{
                this.player = new Player();
            }
            this.gameId = tmpPlayer.gameId;
            var self=this;
            var extraParam = {"register":{"gameClass":this.class},
                              "login":{"gameClass":this.class}}  ,
                authenticationSuccess = function(data){
/**/ $('body>header').append("<h2> Alors…"+JSON.stringify(data)+"</h2>");
                    self.player = new Player(data.player, data.team);
                    self.gameId = data.game;
                    self.loadBoard(dataSourceBoard);
                    self.setUpEvents();
                    self.storage.savePlayer(self.player, self.gameId);
                    self.setUpMessages();
                },
                authenticationFailure = function(data){
/*TODO better message*/ window.alert("La connexion a été refusée par le serveur, reconnectez-vous");
                };
            if(!this.player.isEmpty()){
                this.client = new UglyAuth_io(dataSourceConfig,
                    authenticationSuccess,
                    authenticationFailure,
                    this.player.getId(), this.class, extraParam);
            }
            else{
                this.client = new UglyAuth_io(dataSourceConfig,
                    authenticationSuccess, authenticationFailure,
                    false, extraParam);
            }
        },

        getSelectedCard: function(){
            var id = $("[data-selected-by="+this.player.getId()+  "]").attr("id");
            if(typeof id=="undefined"){
                return false;
            }
            else{
                return this.cards[id];
            }
        },

        loadBoard: function(dataSourceBoard){
            var path="", self=this;
            if(typeof dataSourceBoard == "string"){
                path = dataSourceBoard;
                dataSourceBoard = Util.loadJSON(dataSourceBoard+"/game_data.json");
            }
            this.class = dataSourceBoard.id;//#todo test server before loading
            dataSourceBoard.categories.dim.X = new Category(dataSourceBoard.categories.dim.X.id, dataSourceBoard.categories.dim.X.caption, dataSourceBoard.categories.dim.X.explanation);
            dataSourceBoard.categories.dim.Y = new Category(dataSourceBoard.categories.dim.Y.id, dataSourceBoard.categories.dim.Y.caption, dataSourceBoard.categories.dim.Y.explanation);
            for(var i=0;i<dataSourceBoard.categories.X.length;i++){
                dataSourceBoard.categories.X[i] = new Category(dataSourceBoard.categories.X[i].id, dataSourceBoard.categories.X[i].caption, dataSourceBoard.categories.X[i].explanation, dataSourceBoard.categories.dim.X.id);
            }
            for(i=0;i<dataSourceBoard.categories.Y.length;i++){
                dataSourceBoard.categories.Y[i] = new Category(dataSourceBoard.categories.Y[i].id, dataSourceBoard.categories.Y[i].caption, dataSourceBoard.categories.Y[i].explanation, dataSourceBoard.categories.dim.Y.id);
            }
            this.board = new Table(dataSourceBoard.categories, dataSourceBoard.title, dataSourceBoard.shuffle);
            this.board.spawn();
            this.cards={};
            for(i=0;i<dataSourceBoard.cards.length;i++){
                var img;
                if(Util.isUrl(dataSourceBoard.cards[i].img)){
                    img = dataSourceBoard.cards[i].img;
                }
                else{
                    img = path + "/" + dataSourceBoard.cards[i].img;
                }
                dataSourceBoard.cards[i]=(new Card(dataSourceBoard.cards[i].id, dataSourceBoard.cards[i].name, dataSourceBoard.cards[i].cat, img, dataSourceBoard.cards[i].desc, this.player));
            }
            dataSourceBoard.cards.sort(Card.compare); //Allows to sort them before being able to access them directly through their ids (link evt→object through html element id)
            for(i=0;i<dataSourceBoard.cards.length;i++){
                this.cards[dataSourceBoard.cards[i].id] = dataSourceBoard.cards[i];
                this.cards[dataSourceBoard.cards[i].id].forSendingComment(
                    function(aComment, aCard){//encapsulated in a function, "this" is not the card…
                        self.client.emit("commentCard", {gameId: self.gameId, cardId: aCard, usr:self.player.getPlayerOnly(), comment:aComment});
                    }
                );
                this.cards[dataSourceBoard.cards[i].id].onSendUnselect(function(){
                    //"this" is the card
                    self.client.emit("unselectCard",{gameId: self.gameId, cardId: this.id, usr:self.player.getPlayerOnly()});
                });
                this.cards[dataSourceBoard.cards[i].id].spawn();
                this.cards[dataSourceBoard.cards[i].id].onSendSelect(function(usr){
                    //"this" is the card
                    self.client.emit("selectCard",{gameId: self.gameId, cardId: this.id, usr:usr.getPlayerOnly()});
                });
            }
            $("#help").html(Util.print(Patterns.HELP, [dataSourceBoard.help]));
        },

        /***
         * Event handlling
         */

        setUpEvents: function(){
            var self = this;
            $('td[data-cat]').click(function(){
                var card = self.getSelectedCard();
                if(card !== false){
                    var coords;
                    if(self.board.isInverted()){
                        coords = {X: $(this).parent().attr("id"), Y: $(this).attr("data-cat")};
                    }
                    else{
                        coords = {X: $(this).attr("data-cat"), Y: $(this).parent().attr("id")};
                    }
                    self.client.emit("moveCard",{gameId: self.gameId, cardId: card.id, usr:self.player.getPlayerOnly(), coords: coords});
                }
            });
            //As #stack has no "data-cat" attribute, "undefined" will be provided which is what corresponds to setting a neutral position, which is interpreted as #stack by Card.
            //used menu, because stack only extends as far as the last card in the column uncomfortable for a click… #security
            $("menu").click(function(){
                var card = self.getSelectedCard();
                if(card !== false){
                    card.move(self.player);
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
        },

        setUpMessages: function(){
            var self = this;
            this.client.onSelectCard(function(data){
                self.cards[data.cardId].select(new Player(data.usr));
            });
            this.client.onUnselectCard(function(data){
                self.cards[data.cardId].unselect(new Player(data.usr));
            });
            this.client.onMoveCard(function(data){
                var coords;
                if(self.board.isInverted()){
                    coords={X:data.coords.Y, Y:data.coords.X};
                }
                else{
                    coords = data.coords
                }
                self.cards[data.cardId].move(new Player(data.usr), coords.X, coords.Y);
            });
            this.client.onCommentCard(function(data){
                self.cards[data.cardId].setComment(new Player(data.usr), data.comment);
            });
        }
    });
    return Game;
});