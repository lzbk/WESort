define(['card'], function(Card){ //testing
    var initApp = function(msg){
        var aCard = new Card("carte1", "Le super mausolée", ["mausolée","gallo-romain"], "img/blabla.jpg", "Voilà un super mausolée");
        window.alert(msg);
        $('table').html(aCard.render());
    }
    initApp("youpi");
});
