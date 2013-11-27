/**
 * UglyAuthentication
 * Content: Handling authentication with socket.io
 * Created by loizbek on 01/11/13.
 */

define(['uglyAuth', 'lib/socket.io.min'], function(UglyAuth, io){
    var UglyAuth_io = UglyAuth.extend({
        //ici id = "login"
        //    extraParameters = {"register":{"gameClass":gameId},"login"   :{"gameClass":gameId}}
        init: function(configSource,
                       authenticationSuccess, authenticationFailure,
                       playerId, gameClass,
                       extraParameters){
            if(typeof configSource == "string"){
                configSource = Util.loadJSON(configSource);
            }
            if(typeof configSource.authentication !== "undefined"){
                this.onConnectSuccess(authenticationSuccess);
                this.onConnectFailure(authenticationFailure);
                //initialize display (_super.init) of authentication no matter what…
                //in case of error (could be more efficient)
                if(playerId === false){//optional parameters
                    extraParameters = gameClass;
                }
                this._super(configSource.authentication, extraParameters);
                this.url = configSource.websocket.url;
                this.port = configSource.websocket.port;
                this.gameClass = gameClass;
                this.playerJoin = function(){};
                this.playerLeave = function(){};
                var self = this;
                this.onSendForm(function(){
                    //only called if form is OK see uglyAuth.js
                    self.socket = io.connect(self.url+":"+self.port+self.fieldsToUrl(),{'force new connection': true});
                    self.initCallbacks();
                });//end send Form
                if(playerId === false){
                    this.displayLogin();
                }
                else{//directly try to connect to server
                    this.socket = io.connect(this.url+":"+this.port+"?action=login&gameClass="+this.gameClass+"&playerId="+playerId);
                    self.initCallbacks();
                }
            }
            else{
                window.alert("No player and no authentication driver");
            }
        },

        initCallbacks: function(){
            var self = this;
            this.socket.on("connection established", function(data){
                console.log(data);/**/
                self.connectSucces(data);
            });
            this.socket.on("error", function(data){
                self.connectFailure(data);
            });
            this.socket.on("join", function(data){
                self.playerJoin(data);
            });
            this.socket.on("leave", function(data){
                self.playerLeave(data);
            });
        },

        getSocket: function(){
            if(typeof this.socket == "undefined"){
                return false;
            }
            else{
                return this.socket;
            }
        },

        emit: function(message, data, callback){
            console.log("emit", message, data);
            this.socket.emit(message, data);
        },

        on: function(message, callback){
            this.socket.on(message, callback);
        },

        deleteSocket: function(){
            delete this.socket;
        },

        onConnectSuccess: function(callback){
            var self=this;
            this.connectSucces = function(data){
                callback(data);
                self.hideLogin();
            };
        },

        onConnectFailure: function(callback){
            var self=this;
            this.connectFailure = function(data){
                callback(data);
                self.deleteSocket();
                self.displayLogin();
            };
        },

        onSelectCard: function(callback){
            this.socket.on("selectCard", callback);
        },

        onUnselectCard: function(callback){
            this.socket.on("unselectCard", callback);
        },

        onMoveCard: function(callback){
            this.socket.on("moveCard", callback);
        },

        onCommentCard: function(callback){
            this.socket.on("commentCard", callback);
        },


        onPlayerJoin: function(callback){
            this.playerJoin = callback;
            //TODO mettre un message dans le chat quand il y sera…
            //$("#users").html(data.message);/**///TODO replace with users class when implemented
        },
        onPlayerLeave: function(callback){
            this.playerLeave = callback;
            //TODO mettre un message dans le chat quand il y sera…
            //$("#users").html(data.message);/**///TODO replace with users class when implemented
        },

        onValidationRequest: function(callback){
            this.socket.on("request validation", callback);
        },
        onCancelValidation: function(callback){
            this.socket.on("cancel validation", callback);
        },
        onValidation: function(callback){
            this.socket.on("validation", callback);
        },

        displayLogin: function(){
            this.buildLogin();
            this.parent.attr("class", "show");
            this.elt.attr("open", "open");
        },
        hideLogin: function(){
            this.elt.removeAttr("open");
            this.parent.removeAttr("class");
        }
    });

    return UglyAuth_io;
});