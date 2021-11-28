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

// map
// 	Once the maps API is loaded, this variable will hold 
// the reference to the map object, through which we will
// relocate to the address entered into the form.
var map;

// initMap()
//	This is an event handler that gets called as soon as
// the Google Maps API is loaded. We init the map, then
// send a query to Google Places to get the address in
// the form.
function initMap(){
	
	// Prepare home location: SFSU
	var sfsu = new google.maps.LatLng(37.723159, -122.47815);
	
	// Initialize the map
	map = new google.maps.Map(
		document.getElementById('map'), 
		{ center: sfsu, zoom: 16 }
	);
	
	// Prepare a Google Places service
	var service = new google.maps.places.PlacesService(map);
	
	// Prepare the request for Places
	var addressRequest = {
		query: getAddress(),
		fields: ["name", "geometry"]
	}
	
	// Send the request and declare the callback
	service.findPlaceFromQuery(addressRequest, addressQueryCallback);	
}

function addressQueryCallback(results, status) {
	// IF the query was successful
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (i=0; i<results.length; ++i) {
			// Create a marker
			// createMarker(results[i]);
		}
		// Focus on the result
		map.setCenter(results[0].geometry.location);
		
	} else { // IF the query was not successful
		// Alert the user the address was not found.
		errorDialog.show(status);		
	}
}

// getAddress()
//	This function compiles from storage the address that 
// the user entered into the form. This method is called
// during initMap so that we can send the address to the
// Places API.
function getAddress() {
	let address = storage.values.address + " ";
	let apartment = storage.values.apartment + " ";
	let city = storage.values.city + " ";
	let state = storage.values.state + " ";
	let country = storage.values.country + " ";
	let zip = storage.values.zip;
	return address + apartment + city + state + country + zip;
}

// Edit Control
// 	The event handler for a click of the edit entry button.
// Will simply point us back to form.html.
function returnToEdit(e){
	root = window.location.pathname.split("summary.html")[0];
	window.location.href = root + "form.html";	
}
document.getElementById('edit_entry').addEventListener('click', returnToEdit);

var errorDialog = {
	defs: {
		INVALID_REQUEST: "This request was invalid.",
		OK: "The response contains a valid result.",
		OVER_QUERY_LIMIT: "The webpage has gone over its request quota.",
		REQUEST_DENIED: "The webpage is not allowed to use the PlacesService.",
		UNKNOWN_ERROR: "The PlacesService request could not be processed due to a server error. The request may succeed if you try again.",
		ZERO_RESULTS: "No result was found for this request."
	},
	format: function(type) {
		document.getElementById("status_code").innerText = type.toString();
		document.getElementById("status_meaning").innerText = this.defs[type];
	},
	show: function(status) {
		this.format(status);
		this.trigger();
	},
	trigger: function() {
		this.initialize();
		this.modal.show();
		this.state = this.states.visible;
	},
	hide: function() {
		this.modal.hide();
		this.state = this.states.hidden;
	},
	initialize: function() {
		if (!this.initialized){
			this.modal = new bootstrap.Modal(document.getElementById("dialog_frame"), {});
			this.initialized = true;
		}
	},
		
	states: { hidden: "hidden", visible: "visible" },
	state: "hidden",	
	initialized: false
}
