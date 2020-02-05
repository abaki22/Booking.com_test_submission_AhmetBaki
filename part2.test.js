const part2 = require("./BookingAPI_Part2.js");
const part1c = require('./BookingAPI_Part1_c');

describe("Part 2 end to end test", () => {
    test("Test that an API is setup that returns some result when hit", () => {
        let testRequest = part1c.create_vehicles_request(
            "https://localhost:3000",
            1.0, 2.0, 3.0, 4.0);

        part1c.send_request(testRequest).then((result) => 
            expect(result).toBe(true));
    });
});