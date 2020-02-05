"use strict";

// Requirements
/* Task 1 - a)
Build a console application which calls the API of "Dave's Taxis". 
Print out the search results to the console in descending price order. 
Each line of the output should be in the format {car type} - {price}
The console app should take pickup and drop off locations as command 
line parameters.
*/

// Author - Ahmet Baki, University of Manchester

// System dependancies
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Console handelling
let console_params = process.argv; 

if(console_params.length < 6) {
    throw "Too few console parameters supplied";
} else if(console_params.length > 6) {
    throw "Too many console parameters supplied";
}

// Variable definitions for execution
let URL_daves_API = "https://techtest.rideways.com/dave";
let latitude_pickup = parseFloat(console_params[2]);
let longitude_pickup = parseFloat(console_params[3]);
let latitude_dropoff = parseFloat(console_params[4]);
let longitude_dropoff = parseFloat(console_params[5]);

// Main execution - Create request, send it, print response onto console.
let dave_request = create_vehicles_request(URL_daves_API, 
       latitude_pickup, longitude_pickup, latitude_dropoff, longitude_dropoff);

send_request(dave_request)
        .then((result) => console.log(handle_result(result)));


// Utility Functions

// Construct an API request for the techtest API and return it. 
function create_vehicles_request(URL, lat_p, long_p, lat_d, long_d) {
    let request = new XMLHttpRequest();
    let pickup_value = "" + lat_p + "," + long_p;
    let dropoff_value = "" + lat_d + "," + long_d;
    let parameters = "pickup=" + pickup_value + "&dropoff=" + dropoff_value;



    request.open('GET', URL + "?" + parameters, true);
    return request; 
}

// Send a pre-prepared request and return a race promise that will wait up to
// two seconds before discarding the request. 
function send_request(request) {
    const request_promise = new Promise((resolve, reject) => {
        request.send();
        request.onload = function() {
            resolve(this);
        };
    });

    let max_timeout = 2000;
    const race_condition = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({errorMessage:"Timeout exceeded - Connection terminated"});
        }, max_timeout);
    });

    return Promise.race([request_promise, race_condition]);
}

// Handles the response and returns a string to put out onto the console. 
function handle_result(result) {
    if (typeof(result["errorMessage"]) != "undefined") {
        return result.errorMessage; 
    } else {
        if(result.status == 200) {
            let options = JSON.parse(result.responseText).options;
            let stringToPrint = "\n";
            for (const car of options) {
                stringToPrint += car.car_type + " - " + car.price + "\n";
            }
            return stringToPrint;
        } else {
            // Error occurred. Simply return the error message.
            return JSON.parse(result.responseText).message;
        };
    }
}