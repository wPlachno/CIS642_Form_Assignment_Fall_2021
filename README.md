# CIS642_Form_Assignment_Fall_2021
The individual project of CSC642 at SFSU for the Fall 2021 term was to create a 
simple set of form submission and review pages.

Written by: William Plachno
Date Started: 11/18/2021

Files:
index.html 			- The entrypoint for the system. An html page specifically so that we can have GitHub host our pages.
form.html 			- The first page of this project, form.html is an html form page, designed to the specifications outlined in CSC642, using bootstrap, the google maps api, and a captcha api. Includes a reference to form.js, the file that contains all of the javascript for this html page. 
form.js 			- The javascript that runs form.html
summary.html		- The summary page which loads the data entered into form.html and displays it readonly. Also shows the entered address on a map using Google Maps/Places API.
summary.js			- The javascript the does the google APIs and runs summary.html
storage.js			- A Javascript file specifically for saving and loading form data to sessionStorage
ProjectPrompt.pdf	- The promp for the project, saved and readable.
email.txt			- The text included in the submission email.

To Do:
- Google Maps Integration (form)

Version 0.0.1.1 - 
	Added shortcut to github hosted form
Version 0.0.1.0 -
	Added email.txt, the submission email.
	Configured some localization to match project requirements exactly.
Version 0.0.0.11 - 
	Fixed Phone Number being required, because 0.0.0.10 required more testing.
Version 0.0.0.10 -
	Fixed Phone Number being required.
Version 0.0.0.9 -
	Modified summary to have Service as a text list of accepted services.
	Modified summary to have budget as text.
	Modified summary to have tos as text.
	Added background color
	Limited form width
	Adjusted form control widths
	Added spacing between form controls.
Version 0.0.0.8 - 
	Modified storage to use a default storageKey class
Version 0.0.0.7 -
	Added a marker for the address
	Moved the Google API code into gAPI object
	Added timeout functionality for the connection to Google Services.
	Added connection timeout error message to errorDialog.
	'disabled' the checkboxes and radios on summary.html
	Switched the select of prefTitle to a text bar
Version 0.0.0.6 -
	Added Google Maps API integration (summary.html)
	Added dialog box for API errors (summary.html)
Version 0.0.0.5 -
	Changed the title of the summary page to match requirements
	Added summary.js, a javascript file for controlling the summary page.
	summary will now populate with entered data from form
	The Edit button on the summary page now sends you back to form
	form will now populate if its already been filled out.
	Fixed storage.js, now actually works.
	Fixed submitDialog, now uses an instance of bootstrap.Modal.
Version 0.0.0.4 -
	Added submitDialog for responding to the submit button.
	Made E-Mail entry one input as opposed to two with an @ between them
	Added summary.html, the summary page. Currently equivalent to form.html, but with no error divs, an align right edit button (that does not yet work), and all fields are readonly.
	Added storage.js, which uses sessionStorage to save the form data
Version 0.0.0.3 -  
	Added form.js, the script for running form.html
	The form now has validation.
	Added ProjectPrompt.pdf, the pdf file outlining the entire project.
Version 0.0.0.2 -
	Added index.html file to act as viewer for github hosting.
	Google Recaptcha now works.
Version 0.0.0.1 -
	Added form.html file, implemented core html skeleton.
	Attempted to use Google Recaptcha.
	
Other Notes:
	Google Maps key: AIzaSyA3X_euFDo1zOJm9b-HZ3149M0fjmrgqh4
	Google Recaptcha key: 6LdTB18dAAAAAI8SDqzo1SGWDBab6SERilpgdjqU