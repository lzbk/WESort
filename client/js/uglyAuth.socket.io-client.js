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
                var self = this;
                this.onSendForm(function(){
                    //only called if form is OK see uglyAuth.js
                    self.socket = io.connect(configSource.websocket.url+":"+configSource.websocket.port+self.fieldsToUrl());
                    self.initCallbacks();
                });//end send Form
                if(playerId === false){
                    this.displayLogin();
                }
                else{//directly try to connect to server
                    this._super(configSource.authentication, extraParameters);
                    this.socket = io.connect(configSource.websocket.url+":"+configSource.websocket.port+"?action=login&gameClass="+gameClass+"&playerId="+playerId);
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
                self.connectSucces(data);
            });
            this.socket.on("connection denied", function(data){
                self.connectFailure(data);
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
                self.displayLogin();
            };
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