/**
 * UglyAuthentication
 * User: loizbek
 * Content: Handling authentication
 */

define(function(){
    var UglyAuth = Class.extend({
        init: function(id, dataSource){
            if(typeof dataSource == "string"){
                console.log(dataSource);
                dataSource = Util.loadJSON(dataSource);
                console.log(dataSource);
            }
            this.register = dataSource.form.register ;
            this.login = dataSource.form.login ;
            this.classes = dataSource.form.classes;
            this.text = dataSource.form.text;
            this.elt = $("<"+dataSource.form.containerTag+' id="'+id+'">'+dataSource.form.header+'</'+dataSource.form.containerTag+'/>');
            this.form = $("<form></form>");
            if(typeof this.classes.form !== "undefined"){
                this.form.addClass(this.classes.form);
            }
            this.form.appendTo(this.elt);
            this.items = {};
            var self = this;
            this.form.submit(function(){
                self.hideForm();
            });
        },

        hideForm:function(){
            $('#overlay').removeAttr("class");
        },

        showRegister: function(){
            this.showForm(this.register);
            var self=this, tmpItem = $("<a>"+this.text.login+"</a>");
            tmpItem.click(function(){
                self.showLogin();
            });
            this.form.append($("<p></p>").append(tmpItem));
        },

        showLogin: function(){
            this.showForm(this.login);
            var self=this, tmpItem = $("<a>"+this.text.register+"</a>");
            tmpItem.click(function(){
                self.showRegister();
            });
            this.form.append($("<p></p>").append(tmpItem));
        },

        showForm: function(aForm){
            this.destroyElts();
            for(var i=0; i<aForm.length;i++){
                this.writeItem(aForm[i]);
            }
            $('#overlay').attr("class", "show").append(this.elt);
        },

        writeItem: function(item){
            this.items[item.id] = {type: item.type, optional: item.optional};
            this.form.append("<label>"+ item.text +"</label>");
            var self = this;
            switch(item.type){
                case "text":
                case "e-mail":
                    this.items[item.id].elt = $("<input type='text' id='"+ item.id +"' />");
                    this.form.append(this.items[item.id].elt);
                    this.items[item.id].elt.blur(function(){
                        self.checkField(item.id);
                    });
                    break;
                case "password":
                    this.items[item.id].elt = $("<input type='password' id='"+ item.id +"' />");
                    this.form.append(this.items[item.id].elt);
                    this.items[item.id].elt.blur(function(){
                        self.checkField(item.id);
                    });
                    if(typeof item.textVerification == "string"){
                        this.items[item.id].elt2 = $("<input type='password' id='"+ item.id +"2' />");
                        this.form.append("<label>"+ item.textVerification +"</label>");
                        this.form.append(this.items[item.id].elt2);
                        this.items[item.id].elt2.blur(function(){
                            self.checkField(item.id);
                        });
                    }
                    break;
                case "image":
                    var tmpElt;
                    this.items[item.id].elt = $("<div id='"+ item.id +"' value=''/></div>");
                    this.form.append(this.items[item.id].elt);
                    var imageId;
                    for(var i=0; i<item.images.length;i++){
                        imageId = item.images[i].id;
                        tmpElt = $('<div id="'+item.images[i].id+'"></div>');
                        tmpElt.append('<img src="'+item.images[i].file+'" />');
                        this.items[item.id].elt.append(tmpElt);
                        tmpElt.css("float", "left");
                        tmpElt.css("margin-right", "0.5rem");
                        tmpElt.click(function(){
                            console.log(("#"+item.id+" ."+self.classes.selected));/**/
                            $("#"+item.id+" div").removeClass(self.classes.selected);
                            $(this).addClass(self.classes.selected);
                            $(this).parent().attr("value", this.id);
                        });
                    }
            }

        },

        clearForm: function(){
            Object.keys(this.items).forEach(function (key) {
                this.items[key].elt.val("");
                this.items[key].elt.attr("class","");
                if(typeof this.items[key].elt2 !== "undefined"){
                    this.items[key].elt2.val("");
                    this.items[key].elt2.attr("class","");
                }
            });
        },

        destroyElts: function(){
            this.items = {};
            if(typeof this.form !== "undefined"){
                this.form.children().remove();
            }
        },

        checkField: function(id){
            if(this.items[id].elt.val()==""){
                if(!this.items[id].optional){
                    this.items[id].elt.addClass(this.classes.error);
                    this.items[id].elt.after("<span class='"+this.classes.error+"'>"+this.text.errorEmpty+"</span>");
                }
            }
            else{
                switch(this.items[id].type){
                    case "e-mail":
                        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        if (re.test(this.items[id].elt.val())){
                            this.items[id].elt.addClass(this.classes.ok);
                        }
                        else{
                            this.items[id].elt.addClass(this.classes.error);
                            this.items[id].elt.after("<span class='"+this.classes.error+"'>"+this.text.errorEmail+"</span>");
                        }
                        break;
                    case "password":
                        if( (typeof this.items[id].elt2 !== "undefined") &&
                            (this.items[id].elt2.val() !== "") ){//too bad if the user starts with the second
                            if(this.items[id].elt.val() != this.items[id].elt2.val()){
                                this.items[id].elt.addClass(this.classes.error);
                                this.items[id].elt2.addClass(this.classes.error);
                                this.items[id].elt2.after("<span class='"+this.classes.error+"'>"+this.text.errorPsswd+"</span>");
                            }
                            else{
                                this.items[id].elt.addClass(this.classes.ok);
                                this.items[id].elt2.addClass(this.classes.ok);
                            }
                        }
                        break;
                    case "image":
                        break;
                    default:
                        this.items[id].elt.addClass(this.classes.ok);
                }
            }
        }//end checkField
    });
    return UglyAuth;
});