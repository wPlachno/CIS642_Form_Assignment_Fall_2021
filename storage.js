/*************************************************************
storage.js - the javascript for saving data to the browser
--------------------------------------------------------------
William Plachno
11/26/2021 - 11/30/2021
--------------------------------------------------------------
This file presents a class specifically for loading and saving
the form data from form.html to sessionStorage or from 
sessionStorage to summary.html.
*************************************************************/

// storageKey
//	A class for holding the information for each individual 
// piece of data that we will be saving/loading into storage.
//	This class has a constructor with a name and a sitekey, 
// a save function for saving to storage, a load function for
// loading from storage, a project function for pushing from 
// this objecty out into the html, and a survey function for
// pulling data from the html into this object.
class storageKey {
	constructor(name, siteKey){
		this.name = name;
		this.key = siteKey + '_' + this.name;
		this.data = null; 
	}
	save(){ sessionStorage[this.key] = this.data; }
	load(){ this.data = sessionStorage[this.key]; }
	project(){ document.getElementsByName(this.name)[0].value = this.data; }
	survey(){ this.data = document.getElementsByName(this.name)[0].value; }
}

// storage
//	This object holds all the data for storing information to
// and from sessionStorage, mostly in the form of the storageKey 
// objects. The main external methods are going to be the load 
// function for loading from sessionStorage, the save function 
// to save the keys to storage, the project function to project
// the keys onto the html, and the survey to grab the key data
// from the html.
var storage = {
	siteKey: 'wp6428482021',
	hasData: false,
	keys: [ "lastName", "firstName", "prefTitle", "height", "phoneNum", "address", "apartment", 
	"city", "state", "country", "postal", "service", "budget", "email",	"tos"],
	initialized: false,
	keyFunction: function(keyFunctionName) { for (index in this.keys) { keyFunctionName(this.keys[index]); } },
	load: function() {
		if(sessionStorage[this.siteKey] == 'true') {
			this.keyFunction( name => {
				this[name].load();
			});
			this.hasData = true;
		} else {
			this.error = "Could not load because there is nothing saved.";
		}
	},
	save: function() {
		if (this.hasData == true) {
			this.keyFunction( name => {
				this[name].save();
			});
			sessionStorage[this.siteKey] = true;
		} else {
			this.error = "Could not save because values have not been surveyed.";
		}
	},
	project: function() {
		if (this.hasData == true) {
			this.keyFunction( name => {
				this[name].project();
			});
		} else {
			this.error = "Could not project because no values have been loaded.";
		}
	},
	survey: function() {
		this.keyFunction( name => {
			this[name].survey();
		});
		this.hasData = true;
	},
	initialize: function() {
		this.keyFunction( name => { this[name] = new storageKey(name, this.siteKey); } );
		// Overrides
		this.height.project = function() {
			let raw = this.data;
			let heightcrumbs;
			if (raw.length == 0) { heightCrumbs = ["?","?"]; }
			else { heightCrumbs = this.data.split(':'); }
			document.getElementsByName(this.name + '_feet')[0].value = heightCrumbs[0];
			document.getElementsByName(this.name + '_inches')[0].value = heightCrumbs[1];
		};
		this.height.survey = function() {
			feet = document.getElementsByName(this.name + '_feet')[0].value;
			inches = document.getElementsByName(this.name + '_inches')[0].value;
			this.data = feet + ':' + inches;
		};
		this.phoneNum.project = function() {
			let rawNumber = this.data;
			if (!rawNumber.length == 0) {
				let formattedData = rawNumber.slice(0,3) + '-' + rawNumber.slice(3,6) + '-' + rawNumber.slice(6);
				document.getElementsByName(this.name)[0].value = formattedData;	
			}
		};
		this.phoneNum.survey = function() {
			let text = document.getElementsByName(this.name)[0].value;
			let raw = text.replace(/\D/, ""); 
			while (raw != text) {
				text = raw;
				raw = text.replace(/\D/, "");
			}
			this.data = raw;		
		};
		this.service.project = function() {
			let servCrumbs = this.data.split(':');
			let types = ["email", "phone", "facebook", "twitter", "surface", "visit"];
			for (index in types) {
				let servCrumb = false;
				if (servCrumbs[index] == '1') { servCrumb = true; }
				document.getElementById(this.name + '_' + types[index]).checked = servCrumb;
			}					
		};
		this.service.survey = function() {
			let types = ["email", "phone", "facebook", "twitter", "surface", "visit"];
			typeFlag = "";
			for (index in types){
				typeKey = types[index];
				if (index != 0) { typeFlag = typeFlag + ":"; }
				thisTypeCrumb = "0";
				if (document.getElementById(this.name + '_' + typeKey).checked){ thisTypeCrumb = "1"; }
				typeFlag = typeFlag + thisTypeCrumb;
			}
			this.data = typeFlag;
		};
		this.budget.project = function() {
			let radios = document.getElementsByName(this.name);
			let budgetCrumbs = this.data.split(":");
			for(index in radios) {
				let budgetCrumb = false;
				if (budgetCrumbs[index] == "1") { 
					budgetCrumb = true;
				}
				radios[index].checked = budgetCrumb;
			}
		};
		this.budget.survey = function() {
			let radios = document.getElementsByName(this.name);
			let budgetFlag = "";
			for(index in radios) {
				if (index != 0) { budgetFlag = budgetFlag + ":"; }
				let type = radios[index];
				budgetFlagCrumb = "0";
				if (type.checked) { budgetFlagCrumb = "1"; }
				budgetFlag = budgetFlag + budgetFlagCrumb;
			}
			this.data = budgetFlag;
		};
		this.tos.project = function() {
			tosCheck = true;
			if (this.data == "0") { tosCheck = false; }
			document.getElementById(this.name).checked = tosCheck;
		};
		this.tos.survey = function() {
			tosCrumb = "0";
			if (document.getElementById(this.name).checked) { tosCrumb = "1"; }
			this.data = tosCrumb;
		};
		this.initialized = true;
	}
};
storage.initialize();