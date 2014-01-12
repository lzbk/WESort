/**
 * ClasCol
 * User: loizbek
 * Date: 19/09/13 (10:40)
 * Content: Generate the table
 */

define(function() {
    var Table = Class.extend({
        /**takes the catList to generate a table
         * randomizes lines x columns if randomize is true (by default not)
         * catlist : {dim: [dimension1, dimension2], X:[cat1, cat2], Y:[cat1, cat2]}
         */


        init:function(catList, caption, randomize){
            var tmp;
            this.dimensions = {};
            this.categories = {};
            this.title = caption;
            this.axesInverted = false;
            if(randomize === true){
                 tmp = Util.shuffle([catList.dim.X, catList.dim.Y]);
                 this.dimensions.X=tmp[0];
                 this.dimensions.Y=tmp[1];
                 if(this.dimensions.X.id==catList.X[0].parent){
                     this.categories.X = Util.shuffle(catList.X);
                     this.categories.Y = Util.shuffle(catList.Y);
                 }
                 else{
                     this.categories.Y = Util.shuffle(catList.X);
                     this.categories.X = Util.shuffle(catList.Y);
                     this.axesInverted = true;
                 }
            }
            else{
                 this.dimensions = catList.dim;
                 this.categories.X = catList.X;
                 this.categories.Y = catList.Y;
            }
        },

        isInverted: function(){
            return this.axesInverted;
        },

        print:function(){
            var res, tds="", thc="";
            $('title').html(this.title);
            for(var i=0; i<this.categories.X.length; i++){
                tds += Util.print(Patterns.tableP.TD, [this.categories.X[i].id]);
                thc += Util.print(Patterns.tableP.THC, [this.categories.X[i].explanation, this.categories.X[i].caption]);
            }
            res = Util.print(Patterns.tableP.THEAD,[
                this.dimensions.X.caption,
                this.dimensions.Y.caption,
                this.categories.X.length,
                this.categories.Y.length,
                this.categories.Y[0].id,
                this.categories.Y[0].explanation,
                this.categories.Y[0].caption,
                thc,
                tds,
                this.dimensions.X.explanation,
                this.dimensions.Y.explanation
            ]);
            for(i=1; i<this.categories.Y.length; i++){
                res += Util.print(Patterns.tableP.TR, [
                    this.categories.Y[i].explanation,
                    this.categories.Y[i].caption, this.categories.Y[i].id,
                    tds
                ]);
            }
            return res;
        },

        spawn: function(){
            $("table").html(this.print());
            Patterns.tableP.setSizes(this.categories.X.length,this.categories.Y.length+2);
        }
    });
    return Table;
});