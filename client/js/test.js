define(['card'], function(Card){ //testing
    var initApp = function(msg){

        var aCard = new Card("carte1", "Le super mausolée", ["mausolée","gallo-romain"], "http://www.cevennes-parcnational.fr/var/cevennes/storage/images/mediatheque/images/un-patrimoine-d-exception/histoire-et-prehistoire/mausolee-de-lanuejols2/136949-4-fre-FR/Mausolee-de-Lanuejols_lightbox.jpg", "Voilà un super mausolée");
        aCard.spawn('#stack');
        aCard.updatePos("Moithieu", 0,0);
        aCard.updatePos("Moithieu", 5,5);
        aCard.setComment("Moithieu", "super coolos");
        aCard.updatePos("toitoitoi", 11,1);
        aCard.setComment("toitoitoi", "bah nan c'est nullos, comme toi");
        window.alert("toi → "+aCard.getPosAuthor() + "moi j'ai positionné :" + aCard.getPos("Moithieu").print());

        if(aCard.getCategories("mausolée")){
            window.alert(aCard.getCategories().toString());
        }
        $('#'+aCard.id).replaceWith(aCard.print());
        aCard.setUpEvents();
        var anotherCard = new Card("carte2", "un mausolée nul", ["mausolée", "grec"], "http://3.bp.blogspot.com/_-ZL9GG5XpXI/TLgNBZ9vbOI/AAAAAAAAGR8/wZ0wTZ9ForU/s400/lenine_sarcophage.jpg", "celui là il est mieux ou pas ?");
        anotherCard.spawn($('#stack'));

    }
    initApp("youpi");
});
