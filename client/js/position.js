/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the position of each card
 */

define(['lib/utils'], function(Util){
        var Position = Class.extend({
            coordinates: [],
            //By default 2 dimension but can handle x being an array…
            init: function(x,y){
                this.setCoordinates(x,y);
            },
            //setters
            setCoordinates: function(x,y){
                this.coordinates[0]=x;
                this.coordinates[1]=y;
            },

            //2d getters
            getX: function(){
                return this.getDimension[0];
            },
            getY: function(){
                return this.getDimension[1];
            },
            asString: function(){
                var res="";
                for(var i=0;i<this.coordinates.length;i++){
                    if(res !== ""){
                        res += '.';
                    }
                    res += this.coordinates[i];
                }
                return res;
            },
            //says whether the position is compliant with the values provided.
            compare: function(values){
                return (this.coordinates[0] == values[0] && this.coordinates[1] == values[1]);
            }
        });
        return Position;
    }
);