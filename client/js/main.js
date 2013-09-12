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
                $("#users").html(test);
            }
        });
        top = new Blabla(msg);
    }

    initApp("youpi");
});
