const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

const apiURLPrefix = "http://api.openweathermap.org/";

/**
 * Get weather data based on whether Zipcode or address string was entered.
 * @param {string|number}input
 * @returns {Promise<void>}
 */
async function getWeather(input) {
    try {
        formatCheck(input);
        if (isNaN(input)) {
            const data = await getCoordinates(input);
            return printWeather(await getWeatherData(`lat=${data[0]["lat"]}&lon=${data[0]["lon"]}`));
        }
        printWeather(await getWeatherData(`zip=${input}`));
    } catch (error) {
        console.log(customErrorHandler(error));
    }
}

/**
 * Checks user input format
 * @param {string|number}input
 */
function formatCheck(input) {
    if (input.indexOf(',') >= 2) {
        throw 'format error';
    }
}

/**
 * Gets coordinates for city/state entry.
 * @param {string} input City,State
 * @returns {array[object]}
 */
async function getCoordinates(input) {
    const geoURL = `${apiURLPrefix}geo/1.0/direct?q=${input},us&appid=${process.env.W_API}`;
    try {
        return await buildResponseBody(geoURL);
    } catch (error) {
        throw 'location error';
    }
}

/**
 * Gets the weather data in JSON format.
 * @param input Either Zipcode or GeoCoordinates.
 * @returns {Promise} JSON data.
 */
async function getWeatherData(input) {
    let url = `${apiURLPrefix}data/2.5/weather?${input}&units=imperial&appid=${process.env.W_API}`;
    return await buildResponseBody(url);
}

/**
 * Makes a get request to passed URL
 * @param {string} url Completed API URL
 * @returns {array[object]}
 */
async function buildResponseBody(url) {
    let responseBody = "";
    try {
        responseBody = await axios.get(url);
    } catch (error) {
        return error;
    }
    if (responseBody.data.length === 0) {
        throw 'error';
    }
    return responseBody.data;
}

/**
 * Creates a message to the console using the acquired data.
 * @param {array[object]}data
 */
function printWeather(data) {
    console.log(`The current Temperature in ${data.name} is ${data.main.temp} \u00B0F. It is ${data.weather[0].main.toLowerCase()} outside, with a forecasted high of ${data.main.temp_max}`);
}

/**
 * Customized error handler, either returns a couple typical issues messages or returns any unique issues.
 * @param {object}error
 * @returns {string}
 */
function customErrorHandler(error) {
    if (error === "location error") {
        return "Not a valid location";
    } else if (error === 'format error') {
        return 'There was an error with you entry, please see the "README" file to see correct formatting.';
    }
    return error.message;
}

module.exports = {getWeather};
