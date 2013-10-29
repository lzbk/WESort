var myForm;

myForm.prototype.createLoginForm = function(elt){//prend un élément et le rempli avec ce qu'on veut…
	var self = this;
	this.prototype.launchRegister = function(){
		self.createRegisterForm(elt);
	}
	elt.innerHTML = "<form id='login' action='javascript:myForm.checkLoginForm()'>" +
			  "<label>Nom d'utilisateu</label><input type='text' id='user_name' /><br />" +
			  "<label>Mot de passe</th><td><input type='password' id='password' /><br />"+
			  "</form>"+
			  "<p><a onclick='myForm.launchRegister()'>Créer un compte</a></p>";
};

myForm.prototype.createRegisterForm = function(elt){//prend un élément et le rempli avec un formulaire d'enregistrement
	var self = this;
	this.prototype.launchLogin = function(){
		self.createRegisterForm(elt);
	}
	elt.innerHTML = "<form id='register' action='javascript:myForm.checkRegisterForm()'>" +
			  "<label>Nom d'utilisateu</label><input type='text' id='user_name' /><br />" +
			  "<label>Adresse e-mail</th><td><input type='text' id='email' /><br />" +
			  "<label>Mot de passe</th><td><input type='password' id='password' /><br />"+
			  "<label>Confirmation mot de passe</th><td><input type='password' id='password' /><br />"+
			  "</form>"+
			  "<p><a onclick='myForm.launchLogin()'>Créer un compte</a></p>";
	
}

function checkLoginForm(){
	window.alert('check login');
}

function checkRegisterForm(){
	window.alert('check register');	
}

function sendForm(){
	
}
