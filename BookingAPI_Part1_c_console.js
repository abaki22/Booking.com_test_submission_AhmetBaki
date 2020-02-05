const part1c = require('./BookingAPI_Part1_c');

// Console handelling
let console_params = process.argv; 

if(console_params.length < 7) {
    throw "Too few console parameters supplied";
} else if(console_params.length > 7) {
    throw "Too many console parameters supplied";
}

part1c.query_suppliers(console_params).then((result) => console.log(result));