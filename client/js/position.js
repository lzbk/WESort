/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the position of each card
 */

define([lib/utils], function(Util){
        var Position = Class.extend({
            axes:[],
            coordinates: {},
            //By default 2 dimension but can handle x being an array…
            init: function(axes, x,y){
                this.setAxes(axes);
                this.setCoordinates(x,y);
            },
            //setters
            setCoordinates: function(x,y){
                if(isArray(x)){
                    for(var i=0; i< x.length; i++){
                        this.coordinates[this.axes[i]]=x[i];
                    }
                }
                elseif ((typeof x!== "undefined") && (typeof y!== "undefined")){
                    this.coordinates[this.axes[0]]=x;
                    this.coordinates[this.axes[1]]=y;
                }
            },
            setAxes: function(axes){
                if (typeof axes !== "undefined"){
                    this.axes = axes;
                }
                else{
                    this.axes=["x","y"];
                }
            },

            //check dimensions
            countDims: function(){
                return axes.length;
            },
            checkCoordinates: function(){

            }
            //anyd getter
            getDimension: function(dimId){
                return (typeof this.coordinates !== "undefined") && (typeof this.coordinates[dimId] !== "undefined") && this.coordinates[dimId];
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
            // If strict is false (default) the function will check whether all the coordinates are in the set of values
            // if strict is true, the function will only return true if values contains the same items as the coordinates
            compare: function(values, strict){
                return Util.compare(this.coordinates, values, strict);
            }
        });
        return Position;
    }
);