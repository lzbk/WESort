define(['game', 'uglyAuth.socket.io-client'], function(Game, UglyAuth_io){ //testing
    var initApp = function(msg){
        var jeu = new Game("example", "moi");
        var login = new UglyAuth_io("login", "config.json");
        login.showLogin();
        $('#overlay').attr("class", "show");
        login.elt.attr("open", "open");
        login.elt.children(".closeButton").click(function(){
            login.elt.removeAttr("open");
            $("#overlay").removeAttr("class");
        });
    }
    initApp("youpi");
});
