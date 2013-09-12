/**
 * User: loizbek
 * Date: 10/09/13 (16:42)
 * Content: Some utility functions
 */
define(['json.jquery'], function(Util){
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

    Util.equal
    return Util;
});