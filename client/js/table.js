/**
 * ClasCol
 * User: loizbek
 * Date: 19/09/13 (10:40)
 * Content: Generate the table
 */

define(['category'], function(Position, History) {
    var Table = Class.extend({
        /**takes the catList to generate a table
         * randomizes lines x columns if randomize is true (by default not)
         * catlist : {dim: [dimension1, dimension2], X:[cat1, cat2], Y:[cat1, cat2]}
         */


        init:function(catList, caption, randomize){
            var tmp;
            this.dimensions = {};
            this.categories = {};
             if(randomize === true){
                 tmp = Util.shuffle(catList.dim);
                 this.dimensions.X=tmp[0];
                 this.dimensions.Y=tmp[1];
                 if(this.dimensions.X.id==catList.X[0].parent){
                     this.categories.X = Util.shuffle(catList.X);
                     this.categories.Y = Util.shuffle(catList.Y);
                 }
                 else{
                     this.categories.Y = Util.shuffle(catList.X);
                     this.categories.X = Util.shuffle(catList.Y);
                 }
                 this.caption = caption;
             }
            else{
                 this.dimensions = catList.dim;
                 this.categories.X = catList.X;
                 this.categories.Y = catList.Y;
             }
        },

        print:function(){
            var res, tds="", thc="";
            for(var i=0; i<this.categories.X.length; i++){
                tds += Util.print(Patterns.TD, [this.categories.X[i].id]);
                thc += Util.print(Patterns.THC, [this.categories.X[i].explanation, this.categories.X[i].caption]);
            }
            res = Util.print(Patterns.THEAD,[
                this.caption,
                this.dimensions.X.caption,
                this.dimensions.Y.caption,
                this.categories.X.length,
                this.categories.Y.length,
                this.categories.Y[0].id,
                this.categories.Y[0].explanation,
                this.categories.Y[0].caption,
                thc,
                tds
            ]);
            for(i=1; i<this.categories.Y.length; i++){
                res += Util.print(Patterns.TR, [
                    this.categories.Y[i].explanation, this.categories.Y[i].caption,
                    this.categories.Y[i].id, tds
                ]);
            }
            return res;
        },

        spawn: function(){
            $("table").html(this.print());
        }
    });
    return Table;
});