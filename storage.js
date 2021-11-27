/*************************************************************
storage.js - the javascript for saving data to the browser
--------------------------------------------------------------
William Plachno
11/26/2021
--------------------------------------------------------------
This file presents a class specifically for loading and saving
the form data from form.html to sessionStorage. 
*************************************************************/

var storage = {
	siteKey: 'wp6428482021',
	keys: [
		"lastName", 
		"firstName", 
		"prefTitle", 
		"height",
		"phoneNum", 
		"address", 
		"apartment", 
		"city", 
		"state",
		"country", 
		"postal", 
		"service", 
		"budget", 
		"email",
		"tos"
	],
	values: {
		wp6428482021: false;
	},
	load: function() {
		if(sessionStorage[this.siteKey] == 'true') {
			for (index in this.keys) {
				key = this.keys[index];
				this.values[key] = sessionStorage[this.siteKey + '_' + key];
			}
			this.values[this.siteKey] = true;
		} else {
			this.error = "Could not load because there is nothing saved.";
		}
	},
	save: function() {
		if (this.values[siteKey] == true) {
			for (index in this.keys) {
				key = this.keys[index];
				sessionStorage[this.siteKey + '_' + key] = this.values[key];
			}
			sessionStorage[this.siteKey] = true;
		} else {
			this.error = "Could not save because values have not been surveyed.";
		}
	},
	project: function() {
		if (this.values[this.siteKey] == true) {
			for (index in this.keys) {
				key = this.keys[index];
				data = this.values[key];
				
				if (key == "height") {
					let heightCrumbs = data.split(':');
					document.getElementsByName(key + '_feet').value = heightCrumbs[0];
					document.getElementsByName(key + '_inches').value = heightCrumbs[1];
					
				} else if (key == "phoneNum") {
					let formattedData = data.splice(0,2) + '-' + data.splice(3,5) + '-' + data.splice(6);
					document.getElementsByName(key).value = formattedData;					
					
				} else if (key == "service") {
					let servCrumbs = data.split(':');
					let types = ["email", "phone", "facebook", "twitter", "surface", "visit"];
					for (index in types) {
						let servCrumb = false;
						if (types[index] == '1') { servCrumb = true; }
						document.getElementById(key + '_' + type).checked = servCrumb;
					}					
					
				} else if (key == "budget") {
				let radios = document.getElementsByName(key);
				let budgetCrumbs = data.split(":");
				for(index in radios) {
					let budgetCrumb = false;
					if (budgetCrumbs[index] == "1") { 
						budgetCrumb = true;
					}
					radios[index].checked = budgetCrumb;
				}
					
				} else if (key == "tos") {
					tosCheck = true;
					if (data == "0") { tosCheck = false; }
					document.getElementById(key).checked = tosCheck;
					
				} else {
					document.getElementsByName(key)[0].value = data;
				}
			}
		} else {
			this.error = "Could not project because no values have been loaded.";
		}
	},
	survey: function() {
		for (index in this.keys) {
			key = this.keys[index];
			
			if (key == "height") {
				feet = document.getElementsByName(key + '_feet')[0].value;
				inch = document.getElementsByName(key + '_inches')[0].value;
				this.values[key] = feet + ':' + inches;
			
			} else if (key == "phoneNum") {
				let text = document.getElementsByName(key)[0].value;
				let raw = text.replace(/\D/, ""); 
				while (raw != text) {
					text = raw;
					raw = text.replace(/\D/, "");
				}
				this.values[key] = raw;		
				
			} else if (key == "service") {
				let types = ["email", "phone", "facebook", "twitter", "surface", "visit"];
				typeFlag = "";
				for (index in types){
					typeKey = types[index];
					if (index != 0) { typeFlag = typeFlag + ":"; }
					thisTypeCrumb = "0";
					if (document.getElementById(key + '_' + type).checked){ thisTypeCrumb = "1"; }
					typeFlag = typeFlag + thisTypeCrumb;
				}
				this.values[key] = typeFlag;
				
			} else if (key == "budget") {
				let radios = document.getElementsByName(key);
				let budgetFlag = "";
				for(index in radios) {
					if (index != 0) { budgetFlag = budgetFlag + ":"; }
					let type = radios[index];
					budgetFlagCrumb = "0";
					if (type.checked) { budgetFlagCrumb = "1"; }
					budgetFlag = budgetFlag + budgetFlagCrumb;
				}
				this.values[key] = budgetFlag;
				
			} else if (key == "tos") {
				tosCrumb = "0";
				if (document.getElementById(key).checked) { tosCrumb = "1"; }
				this.values[key] = tosCrumb;
				
			} else {
				this.values[key] = document.getElementsByName(key)[0].value;
			}
		}
		this.values[this.siteKey] = true;
	}
		
}