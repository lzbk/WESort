/**
 * WESort
 * User: loizbek
 * Date: 16/09/13 (10:32)
 * Content: A class to describe the categories to which the cards belong
 * NB : categories can be grouped into categories… the parent category will have false as a parent (cf. isDimension())
 */
define(function(){
    var Category = Class.extend({
        init: function(id, caption, explanation, parent){
            this.id = id;
            this.explanation = explanation;
            this.caption = caption;
            if(typeof parent !== "undefined"){
                this.parent = parent;
            }
            else{
                this.parent = false;
            }
        },

        isDimension: function(){
            return this.parent === false;
        },

        isSonOf: function(mama){
            return this.parent == mama.id;
        }
    });
    return Category;
});