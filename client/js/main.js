define(['position'], function(Position){ //testing
    var initApp = function(msg){
        var aPosition = new Position("mausolée","gallo-romain");
        window.alert(msg);
        $('#stack').html(aPosition.asString());
    }
    initApp("youpi");
});
