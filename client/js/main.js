define(function(){
    var initApp = function(msg){
        Test = Class.extend({
            init : function(){
                window.alert('youpo');
            }
        });
        Blabla = Test.extend({
            init: function(test){
                this._super();
                window.alert(test);
            }
        });
        top = new Blabla(msg);
    }

    initApp("youpi");
});
