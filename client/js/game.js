/**
 * ClasCol
 * User: loizbek
 * Date: 20/09/13 (00:45)
 * Content: The game itself, linking cards, table and user
 */
define(['table', 'card', 'category', 'storage', 'player', 'team', 'uglyAuth.socket.io-client'],
        function(Table, Card, Category, Storage, Player, Team, UglyAuth_io){
    var Game = Class.extend({
        init: function(dataSourceBoard, dataSourceConfig){//dataSource, either an object or a string pointing to a directory containing a game_data.json file (no '/' at the end of the path)
            this.storage = new Storage(this.getBoardContent(dataSourceBoard), true);
            var tmpPlayer = this.storage.loadPlayer();
            if (tmpPlayer !== false){
                this.player = new Player({id:tmpPlayer.id, name: tmpPlayer.name});
            }
            else{
                this.player = new Player();
            }
            this.gameId = tmpPlayer.gameId;
            var self=this;
            var extraParam = {"register":{"gameClass":this.gameClass},
                              "login":{"gameClass":this.gameClass}}  ,
                authenticationSuccess = function(data){
                    self.player = new Player(data.player);
                    self.team = new Team("users", data.team, self.player, data.online);
                    self.gameId = data.game.id;
                    self.loadBoard();
                    self.setUpEvents();
                    self.storage.savePlayer(self.player, self.gameId);
                    self.setUpMessages();
                    self.restoreState(data.game.state);
                    $("#overlay").removeAttr("class");
                    $("#loading").remove();
                    //Load game content
                        //validation requests…
                    for(var i=0; i<data.game.validationRequests.true.length; i++){
                        self.team.validationRequest(
                            data.game.validationRequests.true[i]);
                    }
                    if(self.team.getTeamSize()==
                        data.game.validationRequests.true.length){
                        self.validate();
                    }
                },
                authenticationFailure = function(data){
/*TODO better message*/ window.alert("La connexion a été refusée par le serveur, reconnectez-vous");
                };
            if(!this.player.isEmpty()){
                this.client = new UglyAuth_io(dataSourceConfig,
                    authenticationSuccess,
                    authenticationFailure,
                    this.player.getId(), this.gameClass, extraParam);
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

        getBoardContent: function(dataSourceBoard){
            if(typeof dataSourceBoard == "string"){
                this.data = Util.loadJSON(dataSourceBoard+"/game_data.json");
                this.data.path = dataSourceBoard;
            }
            this.gameClass = this.data.id;
            return this.gameClass;
        },
        //getBoard must have been called before
        loadBoard: function(){
            if(typeof this.data !== "undefined"){
                var self=this;
                //#todo test server before loading why? I don't remember
                this.feedback = this.data.feedback;
                this.data.categories.dim.X = new Category( this.data.categories.dim.X.id,  this.data.categories.dim.X.caption,  this.data.categories.dim.X.explanation);
                this.data.categories.dim.Y = new Category( this.data.categories.dim.Y.id,  this.data.categories.dim.Y.caption,  this.data.categories.dim.Y.explanation);
                for(var i=0;i< this.data.categories.X.length;i++){
                     this.data.categories.X[i] = new Category( this.data.categories.X[i].id,  this.data.categories.X[i].caption,  this.data.categories.X[i].explanation,  this.data.categories.dim.X.id);
                }
                for(i=0;i< this.data.categories.Y.length;i++){
                     this.data.categories.Y[i] = new Category( this.data.categories.Y[i].id,  this.data.categories.Y[i].caption,  this.data.categories.Y[i].explanation,  this.data.categories.dim.Y.id);
                }
                this.board = new Table( this.data.categories,  this.data.title, Util.print(Patterns.LOADING,[this.data.loadingMessage]),  this.data.shuffle);
                this.board.spawn();
                this.cards={};
                for(i=0;i< this.data.cards.length;i++){
                    var img;
                    if(Util.isUrl( this.data.cards[i].img)){
                        img =  this.data.cards[i].img;
                    }
                    else{
                        img =  this.data.path + "/" +  this.data.cards[i].img;
                    }
                    this.data.cards[i]=(new Card( this.data.cards[i].id,  this.data.cards[i].name, this.board.isInverted(), this.data.cards[i].categories, img,  this.data.cards[i].desc, this.player));
                }
                 this.data.cards.sort(Card.compare); //Allows to sort them before being able to access them directly through their ids (link evt→object through html element id)
                for(i=0;i< this.data.cards.length;i++){
                    this.cards[ this.data.cards[i].id] =  this.data.cards[i];
                    this.cards[ this.data.cards[i].id].forSendingComment(
                        function(aComment, aCard){//encapsulated in a function, "this" is not the card…
                            self.client.emit("commentCard", {gameId: self.gameId, cardId: aCard, usr:self.player.getPlayerOnly(), comment:aComment});
                        }
                    );
                    this.cards[ this.data.cards[i].id].onSendUnselect(function(){
                        //"this" is the card
                        self.client.emit("unselectCard",{gameId: self.gameId, cardId: this.id, usr:self.player.getPlayerOnly()});
                    });
                    this.cards[ this.data.cards[i].id].spawn();
                    this.cards[ this.data.cards[i].id].onSendSelect(function(usr){
                        //"this" is the card
                        self.client.emit("selectCard",{gameId: self.gameId, cardId: this.id, usr:usr.getPlayerOnly()});
                    });
                }
                $("#help").html(Util.print(Patterns.HELP, [ this.data.help]));
                delete this.data;
            }
            else{
                console.error("#loaderror, trying to load a board that has not been “got” yet.");
            }
        },

        restoreState: function(state){
            var self = this;
            Object.keys(state).forEach(function (card){
                if(typeof state[card].lastPositions !== "undefined"){
                    self.cards[card].restoreMoves(self.board.isInverted(),state[card].lastPositions);
                }
                //TODO last comment
            });
        },

        testBoard: function(){
            var res = 0, self=this;
            Object.keys(this.cards).forEach(function (key) {
                if(self.cards[key].evaluate()===false){
                    res++;
                }
            });
            if (res == 0){
                res = true;
            }
            return res;
        },

        validate: function(){
            var title, content, res = this.testBoard();
            if(res === true){
                title = this.feedback.true.title;
                content = this.feedback.true.content;
            }
            else{
                title = Util.print(this.feedback.false.title, [res]);
                content = this.feedback.false.content;
            }
            $("#overlay").attr("class", "show");
            $("#message").html(Util.print(Patterns.VALIDATION, [title,content]));
            $("#message").attr("open", "open");
            $("#message .closeButton").click(function(){
                $("#message").removeAttr("open");
                $("#overlay").removeAttr("class");
            });
        },

        /***
         * Event handlling
         */

        setUpEvents: function(){
            var self = this;
            /***** CARDS *****/
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
            //used menu, because stack only extends as far as the last card in the stack and we want the whole surface of the menu, not just the stack div #security
            $("menu").click(function(){
                var card = self.getSelectedCard();
                if(card !== false){
                    card.move(self.player);
                }
            });

            /***** TEAM *****/
            //to be called on button push initiated in class Team
            this.team.onSendValidationRequest(function(){
                self.client.emit("request validation", {gameId:self.gameId, usr:self.player.getPlayerOnly()});
            });
            this.team.onSendCancelValidation(function(){
                self.client.emit("cancel validation", {gameId:self.gameId, usr:self.player.getPlayerOnly()});
            });

            /***** HELP *****/
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
            this.client.onPlayerJoin(function(data){
                self.team.connect(data.player.id);
            });
            this.client.onPlayerLeave(function(data){
                self.team.disconnect(data.player.id);
            });
            this.client.onValidationRequest(function(data){
                self.team.validationRequest(data.player.id);
            });
            this.client.onCancelValidation(function(data){
                self.team.cancelValidation(data.player.id);
            });
            this.client.onValidation(function(data){
               self.validate();
            });
        }
    });
    return Game;
});