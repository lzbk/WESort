/**
 * WESort
 * User: loizbek
 * Date: 10/09/13 (10:32)
 * Content: A class to describe the position of each card. x & y are the ids from category objects
 */

define(function(){
        var Position = Class.extend({
            coordinates: undefined,
            //By default 2 dimension but can handle x being an array…
            init: function(x,y){
                this.setCoordinates(x,y);
            },
            //setters
            setCoordinates: function(x,y){
                if(typeof x === "undefined"){
                    this.coordinates = undefined;
                }
                else{
                    if(!this.inTable()){
                        this.coordinates = [];
                    }
                    this.coordinates[0]=x;
                    this.coordinates[1]=y;
                }
            },

            inTable: function(){
                return (typeof this.coordinates !== "undefined");
            },
            //2d getters
            getX: function(){
                return this.inTable() && this.coordinates[0];
            },
            getY: function(){
                return this.inTable() && this.coordinates[1];
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
            compare: function(values){//#TODO peut être laisser le test au niveau du jeu.
                var res;
                if(typeof values === "undefined"){
                    res = !this.inTable();
                }
                else{
                    res = this.inTable() && (this.coordinates[0] == values[0] && this.coordinates[1] == values[1]);
                }
                return res;
            },

            print: function(){
                if(!this.inTable()){
                    return "";
                }
                else{
                    return this.getX()+", "+this.getY();
                }
            }
        });
        return Position;
    }
);