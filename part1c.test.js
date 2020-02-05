const part1c = require('./BookingAPI_Part1_c');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const express = require('express');

// Tests for is_cartype_viable

describe("is_cartype_viable function should return correct result", () => {
    test("car_type standard with less than or equal to 4 passengers should" + 
         " return true. Otherwise, should be false", () => {
        expect(part1c.is_cartype_viable('standard', 5)).toBe(false);
        expect(part1c.is_cartype_viable('standard', 3)).toBe(true);
        expect(part1c.is_cartype_viable('standard', 4)).toBe(true);
    });

    test("car_type minibus with less than or equal to 16 passengers should" + 
         " return true. Otherwise, should be false.", () => {
            expect(part1c.is_cartype_viable('minibus', 14)).toBe(true);
            expect(part1c.is_cartype_viable('minibus', 12)).toBe(true);
            expect(part1c.is_cartype_viable('minibus', 419)).toBe(false);
    });
});

describe("create_vehicles_request function should return an XML HTTP request", 
() => {
    test("create_vehicles_request function should return an XML HTTP request",
    () => {
        let testRequest = part1c.create_vehicles_request(
            "https://techtest.rideways.com/dave",
            1.0, 2.0, 3.0, 4.0)
    
        expect(testRequest instanceof XMLHttpRequest).toBe(true);

    });
});

describe("send_request function should return a promise race condition", 
() => {
    test("send_request function should return a promise", () => {
        let testRequest = part1c.create_vehicles_request("", 0.0, 0.0, 0.0, 0.0);
        expect(part1c.send_request(testRequest) instanceof Promise).toBe(true);
    });
});
