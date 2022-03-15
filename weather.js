const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

const apiURLPrefix = "http://api.openweathermap.org/";

/**
 * Runs a conditional to distinguish if Zipcode or address string was entered.
 * @param {string|number}input
 * @returns {Promise<void>}
 */
async function getWeather(input) {
    if (isNaN(input)) {
        const data = await getCoordinates(input);
        await getWeatherData(`lat=${data[0]["lat"]}&lon=${data[0]["lon"]}`);
        return;
    }
    await getWeatherData(`zip=${input}`);
}

/**
 * Gets coordinates for city/state entry.
 * @param {string} input City,State
 * @returns {array[object]}
 */
async function getCoordinates(input) {
    const geoURL = `${apiURLPrefix}geo/1.0/direct?q=${input},us&appid=${process.env.W_API}`;
    let data = await buildResponseBody(geoURL);
    if (data.length === 0) {
        return console.error(`${input} is not a valid location, please try again.`);
    }
    return data;
}

/**
 * Gets the weather data in JSON format.
 * @param input Either Zipcode or GeoCoordinates.
 * @returns {Promise} JSON data.
 */
async function getWeatherData(input) {
    let url = `${apiURLPrefix}data/2.5/weather?${input}&units=imperial&appid=${process.env.W_API}`;
    const weatherJSON = await buildResponseBody(url);
    printWeather(weatherJSON);
}

/**
 * Makes a get request to passed URL
 * @param {string} url Completed API URL
 * @returns {array[object]}
 */
async function buildResponseBody(url) {
    let responseBody = "";
    try {
        const request = await axios.get(url);
        responseBody = request.data;
    } catch (error) {
        console.error('There was an error with you entry, please see the "README" file to see correct formatting.');
    }
    return responseBody;
}

/**
 * Creates a message to the console using the acquired data.
 * @param {array[object]}data
 */
function printWeather(data) {
    console.log(`The current Temperature in ${data.name} is ${data.main.temp} \u00B0F. It is ${data.weather[0].main.toLowerCase()} outside, with a forecasted high of ${data.main.temp_max}`);
}

module.exports = {getWeather};
