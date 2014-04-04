/**
 * WESort
 * User: loizbek
 * Date: 10/09/13 (11:05)
 * Content: A class to handle traces   ??
 */

define(function(){
    var Trace = Class.extend({
        timestamp: null, //when the action took place
        user: null,      //who performed the action
        action: null,    //what was the action
        object: null,    //on what was the action performed

        init: function(ts, usr, act, obj){
            this.timestamp= ts;
            this.user     = usr;
            this.action   = act;
            this.object   = obj;
        }
    });

    var Traces = Trace.extend({
        traces: null,

        init: function(){
            this.traces = [];
        },

        addTrace: function(id, ts, act){
            this.traces.push(new Quizz.Trace(id,ts,act));
        },

        fill: function(jsonedTraces){
            this.traces = jsonedTraces.traces;
        }
    });
});