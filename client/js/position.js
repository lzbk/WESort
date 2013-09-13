/**
 * ClasCol
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the position of each card
 */

define(['lib/utils'], function(Util){
        var Position = Class.extend({
            coordinates: [],
            STACK:0;
            //By default 2 dimension but can handle x being an array…
            init: function(x,y){
                this.setCoordinates(x,y);
            },
            //setters
            setCoordinates: function(x,y){
                if(typeof x == "undefined"){
                    this.coordinates = this.STACK;
                }
                else{
                    this.coordinates[0]=x;
                    this.coordinates[1]=y;
                }
            },

            inTable: function(){
                return this.coordinates !== this.STACK;
            }
            //2d getters
            getX: function(){
                return this.inTable() && this.getDimension[0];
            },
            getY: function(){
                return this.inTable() && this.getDimension[1];
            },
            asString: function(){
                var res="";
                if(this.inTable()){
                    for(var i=0;i<this.coordinates.length;i++){//#render
                        if(res !== ""){
                            res += '.';
                        }
                        res += this.coordinates[i];
                    }
                }
                else{
                    res = "Non Classé"; //#msg
                }
                return res;
            },
            //says whether the position is compliant with the values provided.
            compare: function(values){
                var res;
                if(!values.isArray()){
                    res = !this.inTable();
                }
                else{
                    res = this.inTable() && (this.coordinates[0] == values[0] && this.coordinates[1] == values[1]);
                }
                return res;
            }
        });
        return Position;
    }
);