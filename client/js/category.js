/**
 * ClasCol
 * User: loizbek
 * Date: 16/09/13 (10:32)
 * Content: A class to describe the categories to which the cards belong
 * NB : categories can be grouped into categories… the parent category will have false as a parent
 */
define(function(){
    var Category = Class.extend({
        init: function(id, title, parent, explanation){
            this.id = id;
            this.title = title;
            if(typeof parent !== "undefined"){
                this.family = parent;
            }
            else{
                this.family = false;
            }
        }
    });
    return Category;
});