/*************************************************************
summary.js - the javascript for summary.html
--------------------------------------------------------------
William Plachno
11/28/2021
--------------------------------------------------------------
There are three tasks covered in this javascript:
1) sessionStorage integration using storage.js
2) Google Maps integration
3) Edit control
*************************************************************/

// Storage integration
// When done loading...
function loadStorage() {
	storage.load();
	storage.project();
}
window.addEventListener('load', loadStorage());

// Google Maps Integration

// Edit Control
function returnToEdit(e){
	root = window.location.pathname.split("summary.html")[0];
	window.location.href = root + "form.html";	
}
document.getElementById('edit_entry').addEventListener('click', returnToEdit);