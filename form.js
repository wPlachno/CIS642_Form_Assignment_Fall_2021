/*************************************************************
form.js - the javascript for form.html
--------------------------------------------------------------
William Plachno
11/26/2021
--------------------------------------------------------------
There are three categories of javascript covered in this file:
1- Operational: 	Javascript to aid in interaction with the 
					page.
2- Validation: 		Javascript to validate the form data.
3- Submission: 		Javascript to control how our system saves 
					the form.
*************************************************************/
// Operational

// DEBUG: If this is true, then we override checking the captcha.
var DEBUG = true;

// getValueOf: This queries the DOM for the value of the element 
//		with the given name.
function getValueOf(inputName){
	return document.getElementsByName(inputName)[0].value;
}

// Validation

// validator
// This base class provides a framework to make as much of the validation
// as simple as possible. The main functions of the validator class are
// data() and validate(). data() is intended to compile the necessary info
// from the DOM. validate() is intended to return a boolean of whether
// the input is valid according to our requirements. The base validate()
// checks that the length of the value is less than or equal to forty
// characters- the validation requirement for 6 out of 16 of our controls.
class validator {
	constructor(name) {
		this.name = name;
		this.hide();
	}
	data = function() { return getValueOf(this.name); }
	validate = function() { return this.data().length <= 40 && this.data().length > 0; }
	hide = function() { 
		ele = document.getElementById('ERR_' + this.name);
		if (ele != null) {
			ele.style.display = "none";
		}
	}
	show = function() {
		ele = document.getElementById('ERR_' + this.name);
		if (ele != null) {
			ele.style.display = "block";
		}
	}		
}
		
// validation
// Validation is an object which holds all of the validators that we need.
// While the base validator class was designed to satisfy the validation 
// requirements of most of the entries, some of the form controls will
// need to override the data() function and/or the validate() function.
var validation = {
	keys: [],
	invalid: [],
	add: function(name) {
		this.keys.push(name);
		current = new validator(name);
		this[name] = current;
		current.hide();
	},
	addArray: function(arr){
		for (ele in arr) {
			this.add(arr[ele]);
		}
	},
	validate: function() {
		this.invalid = [];
		for (index in this.keys) {
			key = this.keys[index];
			if (!this[key].validate()) {
				this.invalid.push(key);
				this[key].show();
			} else {
				this[key].hide();
			}
		}
		return this.invalid.length == 0;
	},
	compileAll: function() {
		results = {};
		for( index in this.keys ){
			key = this.keys[index];
			results[key] = this[key].data();
		}
		return results;
	}
}
validation.addArray([
	"lastName", "firstName", "prefTitle", "height",
	"phoneNum", "address", "apartment", "city", "state",
	"country", "postal", "service", "budget", "email",
	"tos", "captcha"]);

// validator Overrides

// - prefTitle: [validate] 
//		Make sure a selection was made.
validation.prefTitle.validate = function() { return this.data() != 'Please select your preferred title'; }

// - height: [validate, data]
//		Height has two entries, feet and inches. In validation, this isn't required.
//		When we data(), we also save the raw text as this.raw.
validation.height.validate = function() { 
	dat = this.data();  
	for(i=0; i<2; i++){
		if (this.raw[i].length > 0) {
			if(isNaN(dat[i])) {
				return false;
			}
			if(dat[i] < 0 || dat[i] > 12) {
				return false;
			}
		} 
	}
	return true;
}
validation.height.data = function() { 
	this.raw = [getValueOf(this.name + '_feet'), getValueOf(this.name + '_inches')];
	return [parseInt(this.raw[0]), parseInt(this.raw[1])];
}

// - phoneNum: [validate, data]
//		phoneNum displays with hyphens, but we just want the numbers.
//		For validate(), we need to make sure that there are 10 digits
validation.phoneNum.validate = function() { dat = this.data(); return !isNaN(dat) && this.raw.length == 10; }
validation.phoneNum.data = function() { 
	text = getValueOf(this.name)
	this.raw = text.replace(/\D/, ""); 
	while (this.raw != text) {
		text = this.raw;
		this.raw = text.replace(/\D/, "");
	}
	return parseInt(this.raw); 
}

// - apartment: [validate]
// 		Apartment is optional, but if there is something.
validation.apartment.validate = function() {  
	dat = this.data(); 
	return dat.length == 0 || dat.length <= 40;
}

// - postal: [validate,data]
//		Postal should be a 5-digit number
validation.postal.validate = function() { dat = this.data(); return this.raw.length == 5 && !isNaN(dat); }
validation.postal.data = function() { this.raw = getValueOf(this.name); return parseInt(this.raw) };

// - services: [validate, data]
//		The services check boxes should be done as an array. We add some helper functions
//		specifically for finding and arranging the values.
//		That said, these are not necessary for validation.
validation.service.validate = function() { return true; }
validation.service.types = ["email", "phone", "facebook", "twitter", "surface", "visit"];
validation.service.typeData = function(type) { return document.getElementById(this.name + '_' + type).checked; }
validation.service.data = function() {
	let results = {}
	for (index in this.types) {
		type = this.types[index];
		results[type] = this.typeData(type);
	}
	return results;
}

// - budget: [validate, data]
//		budget is a set of radio buttons. The value we want is the id of the selected radio.
//		For validation, any selection is appropriate.
validation.budget.validate = function() { return true; }
validation.budget.data = function() {
	radios = document.getElementsByName(this.name);
	for (index in radios){
		type = radios[index];
		if (type.checked) {
			return type.id;
		}
	}
}

// - email: [validate, data]
//		email is done using two entries, the text before and the text after the @ sign.
//		validation simply requires that only one @ is present.
validation.email.validate = function() { return this.data().split('@').length == 2; }
validation.email.data = function() { return getValueOf(this.name + '_name') + '@' + getValueOf(this.name + '_server'); }

// - tos: [validate,data]
//		tos is a checkbox the user activates to agree to the terms of service.
//		it must be checked.
validation.tos.validate = function() { return this.data(); }
validation.tos.data = function() { return document.getElementById(this.name).checked; }

// - captcha: [validate,data]
//		captcha is Google's Recaptcha. If the captcha has 
//	been done, grecaptcha.getResponse() will not return an empty string.
validation.captcha.validate = function() { return DEBUG || this.data() != ""; }
validation.captcha.data = function() { return grecaptcha.getResponse(); }

// Submission

// onSubmit()
function validateOnSubmit(e) {
	if (!validation.validate()) {
		e.preventDefault();
		return false;
	} else {
		sum = validation.compileAll();
		root = window.location.pathname.split("form.html")[0];
		window.location.href = root + "index.html";
		e.preventDefault();
		return false;
	}
}
document.getElementById("formA").addEventListener('submit', validateOnSubmit);