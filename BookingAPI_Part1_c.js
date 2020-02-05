"use strict";

// Requirements
/* Task 1 - b)
Add logic to limit the output by taking into account the maximum number of 
passengers available. 
*/

// Author - Ahmet Baki, University of Manchester

// Exports

module.exports = { query_suppliers, 
         create_vehicles_request,
         send_request,
         handle_result,
         is_cartype_viable };

// System dependancies
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Given params (that happen to be structured exactly like console_params), 
// returns a promise. 
function query_suppliers(params) {
    // Variable definitions for execution
    let URL_daves_API = "https://techtest.rideways.com/dave";
    let URL_erics_API = "https://techtest.rideways.com/eric";
    let URL_jeffs_API = "https://techtest.rideways.com/jeff";
    let latitude_pickup = parseFloat(params[2]);
    let longitude_pickup = parseFloat(params[3]);
    let latitude_dropoff = parseFloat(params[4]);
    let longitude_dropoff = parseFloat(params[5]);
    let passenger_number = parseInt(params[6]);

    // Main execution - Create requests, send them, print response onto console.
    let dave_request = create_vehicles_request(URL_daves_API, 
        latitude_pickup, longitude_pickup, latitude_dropoff, longitude_dropoff);

    let eric_request = create_vehicles_request(URL_erics_API, 
        latitude_pickup, longitude_pickup, latitude_dropoff, longitude_dropoff);

    let jeffs_request = create_vehicles_request(URL_jeffs_API, 
        latitude_pickup, longitude_pickup, latitude_dropoff, longitude_dropoff);

    let alternatives = {standard: undefined, executive: undefined,
        luxury: undefined, people_carrier: undefined, 
        luxury_people_carrier: undefined, minibus: undefined};

    send_request(dave_request)
    .then((dave_result) => 
    (handle_result(alternatives, dave_result, passenger_number, "dave")));

    send_request(eric_request)
    .then((eric_result) => 
    (handle_result(alternatives, eric_result, passenger_number, "eric")));

    send_request(jeffs_request)
    .then((result) => 
    (handle_result(alternatives, result, passenger_number, "jeff")));

    // An admittedly lazy but quick and dirty way of blocking the promises 
    // so that a result can be synchronously extracted. 
    let output_string = ""; 
    return new Promise((resolve, reject) => {
        setTimeout(function() {
            output_string += 
                "\n-- Alternatives: Car Type | Best Supplier | Best Price --\n";
            for (const car in alternatives) {
                if (alternatives[car] == undefined) {
                    output_string += car + " - No options\n";
                } else {
                    output_string += car + " - " 
                                    + alternatives[car].supplier + " - " 
                                    + alternatives[car].price + "\n";
                }
            }
            resolve(output_string);
        }, 2500);
    });
}


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

// Handles the response and returns an object to be parsed. 
function handle_result(alternatives, result, passenger_number, supplier) {
    if (typeof(result["errorMessage"]) != "undefined") {
        return result.errorMessage; 
    } else {
        if (result.status == 200) {
            let options = JSON.parse(result.responseText).options;
            for (const car of options) {
                if (is_cartype_viable(car.car_type, passenger_number)) {
                    // stringToPrint += car.car_type + " - " + car.price + "\n";
                    let car_type_LC = car.car_type.toLowerCase();
                    if (alternatives[car_type_LC] == undefined) {
                        alternatives[car_type_LC] = {price: car.price, supplier: supplier};
                    } 

                    if (alternatives[car_type_LC].price > car.price) {
                            alternatives[car_type_LC].price = car.price; 
                            alternatives[car_type_LC].supplier = supplier;
                    }
                }
            }
        } else {
            // Do nothing
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