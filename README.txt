Dependancies: xmlhttprequest
Preliminary: 
> npm install xmlhttprequest

To run Booking API Part 1, a, use (ideally inside VSCode with node installed):

node BookingAPI_Part1_a.js [latitude_pickup] [longitude_pickup] [latitude_dropoff] [longitude_dropoff]

e.g. node BookingAPI_Part1_a.js 51.470020 -0.454295 51 1

Part 1 b can be ran in largely the same way but with the addition of the max_passengers parameter:

node BookingAPI_Part1_b.js [latitude_pickup] [longitude_pickup] [latitude_dropoff] [longitude_dropoff] [max_passengers]

e.g. node BookingAPI_Part1_b.js 51.470020 -0.454295 51 1 3

Part 1 c has to be run slightly modified:

node BookingAPI_Part1_c_console.js [latitude_pickup] [longitude_pickup] [latitude_dropoff] [longitude_dropoff] [max_passengers]

e.g. node BookingAPI_part1_c_console.js 51.470020 -0.454295 51 1 3



To run part 2, must first install express.

npm install express --save

To run, use node BookingAPI_Part2.js, then interact with API with exclusively GET requests.

Can go through browser, e.g. http://localhost:3000/?pickup=51.470020,-0.454295&dropoff=51,1&max_customers=3

Or use some other mechanism. 

Must supply pickup, dropoff and max_customers as parameters



To run tests, first install jest

npm install --save-dev jest

Then, use the following command:

jest
