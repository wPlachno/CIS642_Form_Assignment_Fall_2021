/*************************************************************
summary.js - the javascript for summary.html
--------------------------------------------------------------
William Plachno
11/28/2021
--------------------------------------------------------------
There are four tasks covered in this javascript:
1) sessionStorage integration using storage.js
	- loadStorage()
	- window.onload addListener(loadStorage)
2) Google Maps integration
	- gAPI declaration
	- set queryfailurecallback to trigger the dialog box
	- initMap()
	- getAddress()
3) Edit control
	- returnToEdit()
	- editBtn.click addListener(returnToEdit)
4) Error Dialog
	- errorDialog
*************************************************************/

/************************************************************
// Storage integration
*************************************************************/
// When done loading...
function loadStorage() {
	storage.load();
	storage.project();
}
window.addEventListener('load', loadStorage);

/************************************************************
// Google Maps Integration
*************************************************************/


// gAPI
//	The gAPI object will hold all the code for dealing
// with the Google Maps API.
var gAPI = {
	
	// map
	//	The map variable will hold the map object that
	// we use to populate the map field.
	map: null,
	
	// home
	//	A set of coordinates which correspond to the 
	// location of San Francisco State University.
	home: { lat: 37.723159, lng: -122.47815, obj: null },
	
	// places
	//	An object that holds the information specifically 
	// for using the Google Places API.
	places: {
		
		// service
		//	The actual Google Places Service object.
		service: null,
		
		// marker
		//	The marker object that will be created after
		// a location query.
		marker: null,
		
		// request
		//	The configuration for the places request.
		request: {
			query: null,
			fields: [
				"name",
				"geometry"
			]
		},
		
		// callbacks
		//	This object holds a success callback and a 
		// failure callback for an address request. The
		// location query will have a callback stub which
		// simply determines whether it was successful,
		// then calls either the success callback or the
		// failure callback below.
		callback: {
			success: function(results) {				
				for (i=0; i<results.length; ++i) {
					
					// Create a marker
					gAPI.createAPIObject.marker(
						gAPI.map,
						results[i].geometry.location,
						results[i].name
					);
				}
				// Focus on the result
				gAPI.map.setCenter(results[0].geometry.location);
			},
			failure: function(status){
				gAPI.places.errorCode = status;
			},
			default: function(results, status){
				// IF the query was successful
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					gAPI.places.callback.success(results);					
				} else { // IF the query was not successful
					gAPI.places.callback.failure(status);
				}
			}
		}
	},
	
	// createAPIObject
	//	This object has methods for creating different API
	// objects, including: 
	//	- a location (latlng)
	//	- a map
	//	- a marker
	//	- a placesService
	createAPIObject: {
		latlng: function(coordinates) {
			return new google.maps.LatLng(coordinates.lat, coordinates.lng);
		},
		map: function(mapDivId, startingLatLng) {
			return new google.maps.Map(
				document.getElementById(mapDivId),
				{ center: startingLatLng, zoom: 15 }
			);
		},
		marker: function(mapToMark, locationToMark, nameOfLocation) {
			let mark = new google.maps.Marker({
				position: locationToMark,
				title:    nameOfLocation
			});
			mark.setMap(mapToMark);
			return mark;
		},
		places: function(mapObject){ 
			return new google.maps.places.PlacesService(mapObject);
		}
	},
	
	// connectionCycles
	//	This variable tracks how many times since page load we have 
	// checked for google connection. 
	//	While the page loads, we also have to connect to the Google 
	// APIs. We have a boolean in the html called googleConnected 
	// which is false until the apis connect. We cannot initialize
	// gAPI until connection.
	//	Generally, the apis are connected before the document loads.
	// This is why the check is in the DOM onload event. Nonetheless,
	// we have to make sure. 
	//	Once the DOM is loaded, we call initMap. If googleConnected 
	// is still false, we wait 250 milliseconds, then call it again.
	// Each time we check, we increment gAPI.connectionCycles by 1.
	//	If gAPI.connectionCycles reaches 24, we assume failure and
	// launch an error dialog.
	connectionCycles: 0,
	
	// init
	//	Initializes all of the variables that require the API to
	// be loaded.
	init: function() {
		gAPI.home.obj = gAPI.createAPIObject.latlng(gAPI.home);
		gAPI.map = gAPI.createAPIObject.map('map', gAPI.home);
		gAPI.places.service = gAPI.createAPIObject.places(gAPI.map);
	},
	
	// queryAddress
	//	Sends out a Google Places adress query with the given address.
	queryAddress: function(addressString) {
		gAPI.places.request.query = addressString;
		gAPI.places.service.findPlaceFromQuery(
			gAPI.places.request,
			gAPI.places.callback.default
		);
	}
};
gAPI.places.callback.failure = function(status) {
	errorDialog.show(status);
};

// initMap()
//	This is an event handler that gets called as soon as
// the Google Maps API is loaded. We init the map, then
// send a query to Google Places to get the address in
// the form.
function initMap(){
	
	// Wait for google to be connected
	// googleConnected is a boolean in the html scripts
	// that gets set to true when google is connected.
	if (!googleConnected) {
		
		// Increment our timeout tracker
		++gAPI.connectionCycles;
		
		// If Google has taken too long...
		if (gAPI.connectionCycles >= 24) {
			errorDialog.show('GAPI_CONNECTION_TIMEOUT');
				
		// If we can, wait a quarter-second
		} else {	
			setTimeout(initMap, 250)
		}
		
	} else {
	
		// Initialize the api obj
		gAPI.init();
		
		// Begin address query
		addressToQuery = getAddress();
		gAPI.queryAddress(addressToQuery);
	}
}
window.addEventListener('load', initMap);

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

/************************************************************
// Edit Control
*************************************************************/

// returnToEdit()
// 	The event handler for a click of the edit entry button.
// Will simply point us back to form.html.
function returnToEdit(e){
	root = window.location.pathname.split("summary.html")[0];
	window.location.href = root + "form.html";	
}
document.getElementById('edit_entry').addEventListener('click', returnToEdit);

/************************************************************
// Error Dialog
*************************************************************/

// errorDialog
//	This variable is designed to control the error dialog box.
//	For this page, the only thing accessed from outside the 
// variable is the show() method, which, given a status, will
// make the dialog appear with the correct information.
//	The errorDialog object contains the following:
//	- defs: a dictionary of the status codes to their intended
//			meaning.
//	- format(type): an internal use method to set the text of  
//			the dialog box according to the status passed in.
//	- show(status): a method which pops up the dialog with the
//			information provided by the status.
//	- trigger(): an internal method which does the actual pop
//			up of the dialog box.
//	- hide(): an external method if one needs to close the
//			dialog through code.
//	- initialize(): an internal method which, if it hasn't been
//			done already, will create the javascript object of
//			the bootstrap Modal class.
//	- states: an internal dictionary of [visible, hidden]
//	- state: the dialog's current state.
//	- initialized: whether the initialize method has already 
//			been called.
// KNOWN BUG: The html of the dialog includes the bootstrap 
//			close, meaning errorDialog.hide() is never called,
//			resulting in state never getting switched back to
//			hidden. Left in as it does not affect usage.
var errorDialog = {
	defs: {
		INVALID_REQUEST: "This request was invalid.",
		OK: "The response contains a valid result.",
		OVER_QUERY_LIMIT: "The webpage has gone over its request quota.",
		REQUEST_DENIED: "The webpage is not allowed to use the PlacesService.",
		UNKNOWN_ERROR: "The PlacesService request could not be processed due to a server error. The request may succeed if you try again.",
		ZERO_RESULTS: "No result was found for this request.",
		GAPI_CONNECTION_TIMEOUT: "The attempt to connect to the Google aPI Service took too long. Reload the page and try again."
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
