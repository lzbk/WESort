/**
 * ClasCol
 * Created by loizbek on 11/11/13.
 * The io.socket client
 * could work replacing UglyAuth by socket.io.min but the creator would be altered
 */
define(['uglyAuth.socket.io-client'], function(UglyAuth_io){
    var Client = Class.extend({
        init: function(configSource, gameId, playerId){
            if(typeof configSource == "string"){
                configSource = Util.loadJSON(configSource);
            }
            if(typeof playerId === "undefined"){
                if(typeof configSource.authentication !== "undefined"){
                    this.login = new UglyAuth_io("login",
                        configSource.websocket.url, configSource.websocket.port,
                        configSource.authentication,
                        {"register":{"gameClass":gameId},
                         "login"   :{"gameClass":gameId}});
                    this.login.displayLogin = function(){
                        this.showLogin();
                        $('#overlay').attr("class", "show");
                        this.elt.attr("open", "open");
                    };
                    this.login.hideLogin = function(){
                        this.elt.removeAttr("open");
                        $("#overlay").removeAttr("class");
                    };
                    this.login.displayLogin();
                }
                else{
                    window.alert("No player and no authentication driver");
                }
            }
            else{//directly try to connect to server
                this.socket = io.connect(configSource.websocket.url+":"+configSource.websocket.port+"?gameClass="+gameId+"&playerId="+playerId);
            }
        },

        onConnectSuccess: function(callback){
            this.connectSucces = callback;
        },

        onConnectFailure: function(callback){
            this.connectFailure = callback;
            //Je sais plus où j'en suis réfléchir par rapport au game quand on fait quoi ? ICITE
        },


    });
    return Client;
});