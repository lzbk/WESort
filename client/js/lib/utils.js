/**
 * User: loizbek
 * Date: 10/09/13 (16:42)
 * Content: Some utility functions
 */
define(['lib/json.jquery'], function(){
    //says whether a1 is included in a2 or if a1==a2 if equality is set to true
    //we consider that if either set is empty the result is false, but true if both are (even though this is not inclusion per se)
    //IMPORTANT: works only if each table contains unique values…

    Util.compareTags = function(t1,t2,equality){
        if( (t2.length==0) || (t1.length==0) ){
            return (t2.length==0) && (t1.length==0);
        }
        var i=0,j= 0, a1=[].concat(t1), a2=[].concat(t2);
        while(i<a1.length){
            if(a1[i]==a2[j]){
                a1.splice(i,1);
                a2.splice(j,1);
            }
            else if(j >= (a2.length - 1)){//if the last item was erased…
                i++;
                j=0;
            }
            else{
                j++;
            }
        }
        if(equality){
            return (a1.length==0) && (a2.length==0);
        }
        else{
            return (a1.length==0);
        }
     };

    //taken from http://www.codeproject.com/Tips/201899/String-Format-in-JavaScript
    //replaces {\d} in a string by the corresponding value in an Array
    Util.print=function(str, rplc){
        var regex = new RegExp("{[oc0-9]+}", "g");
        return str.replace(regex, function(item) {
            var val = item.substring(1, item.length - 1);
            var replace="";
            if(val==="o"){
                replace="{";
            }
            else if (val === "c"){
                replace = "}";
            }
            else{
                val = parseInt(val);
                if ( (val >= 0) && (val<rplc.length)){
                    replace = rplc[val];
                }
            }
            return replace;
        });
    };

    //long&short = {action: **, data:**} #security
    Util.longClick = Class.extend({
        init: function(elt, short, long, length){
            if(typeof length === "undefined"){
                length = 500;
            }
            this.duration = length;
            this.startedShort = false;
            this.long = function(){long["action"](long["data"]);};
            var self=this;
            this.short= function(){
                var time = (new Date().getTime()) - self.timer;
                if(time<=self.duration){
                    window.clearTimeout(self.timeout);
                    short["action"](short["data"]);
                    self.timer = undefined;
                }
                self.startedShort = false;
            };

            $(elt).mousedown(function(){
                self.timer = new Date().getTime();
                self.timeout = window.setTimeout(self.long, self.duration);
            });

            $(elt).mouseup(function(){if(!self.startedShort){self.startedShort = true;    self.short();}});
            $(elt).mouseleave(function(){if(!self.startedShort){self.startedShort = true; self.short();}});
        }
    });

    //takes array 'a' and returns it in a different random order (destroys a)
    Util.shuffle = function(a){
        var res=[], i= 0, randId, tmp;
        while(a.length>1){
            randId = Math.floor(Math.random()* a.length);
            res[i] = a[randId];
            a[randId] = a[a.length-1];
            a.pop();
            i++;
        }
        res.push(a.pop());
        return res;
    };
    return Util;

});