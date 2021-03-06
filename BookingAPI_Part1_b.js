"use strict";

// Requirements
/* Task 1 - b)
Add logic to limit the output by taking into account the maximum number of 
passengers available. 
*/

// Author - Ahmet Baki, University of Manchester

// System dependancies
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Console handelling
let console_params = process.argv; 

if(console_params.length < 7) {
    throw "Too few console parameters supplied";
} else if(console_params.length > 7) {
    throw "Too many console parameters supplied";
}

// Variable definitions for execution
let URL_daves_API = "https://techtest.rideways.com/dave";
let latitude_pickup = parseFloat(console_params[2]);
let longitude_pickup = parseFloat(console_params[3]);
let latitude_dropoff = parseFloat(console_params[4]);
let longitude_dropoff = parseFloat(console_params[5]);
let passenger_number = parseInt(console_params[6]);

// Main execution - Create request, send it, print response onto console.
let dave_request = create_vehicles_request(URL_daves_API, 
       latitude_pickup, longitude_pickup, latitude_dropoff, longitude_dropoff);

send_request(dave_request)
        .then((result) => console.log(handle_result(result, passenger_number)));


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
function handle_result(result, passenger_number) {
    if (typeof(result["errorMessage"]) != "undefined") {
        return result.errorMessage; 
    } else {
        if (result.status == 200) {
            let options = JSON.parse(result.responseText).options;
            let stringToPrint = "\n";
            for (const car of options) {
                if (is_cartype_viable(car.car_type, passenger_number)) {
                    stringToPrint += car.car_type + " - " + car.price + "\n";
                }
            }
            
            if (stringToPrint === "\n") {
                stringToPrint += "No viable transportation found.\n";
            }

            return stringToPrint;
        } else {
            // Error occurred. Simply return the error message.
            return JSON.parse(result.responseText).message;
        };
    }
}

// Given a car type and the number of passengers to consider, returns boolean
// based on whether given car type can accomdate specified number of 
// passengers.
function is_cartype_viable(car_type, passenger_number) {
    let car_type_LC = car_type.toLowerCase();
    if ((car_type_LC === "standard") & (passenger_number <= 4)) {
        return true; 
    } else if ((car_type_LC === "executive") & (passenger_number <= 4)) {
        return true;
    } else if ((car_type_LC === "luxury") & (passenger_number <= 4)) {
        return true;
    } else if ((car_type_LC === "people_carrier") & (passenger_number <= 6)) {
        return true;
    } else if ((car_type_LC === "luxury_people_carrier") & 
               (passenger_number <= 6)) {
        return true;
    } else if ((car_type_LC === "minibus") & (passenger_number <= 16)) {
        return true;
    }

    return false; 
}