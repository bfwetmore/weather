const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();
const apiURLPrefix = "http://api.openweathermap.org/";

async function PrintWeather(input) {
  const degreeSymbol = '\u00B0';
  let url = `${apiURLPrefix}data/2.5/weather?${input}&units=imperial&appid=${process.env.W_API}`;
  const weatherJSON = await buildResponseBody(url);
  console.log(`The current Temperature in ${weatherJSON.name} is ${weatherJSON.main.temp} ${degreeSymbol}F. It is ${weatherJSON.weather[0].main.toLowerCase()} outside, with a forecasted high of ${weatherJSON.main.temp_max}`);
}

async function buildResponseBody(response) {
  let responseBody = "";
  try {
    const request = await axios.get(response);
    responseBody = request.data;
  } catch (error) {
    console.error('There was an error with you entry, please see the "README" file to see correct formatting.');
  }
  return responseBody;
}

async function userDataInput(entry) {
  if (isNaN(entry)) {
    const geoURL = `${apiURLPrefix}geo/1.0/direct?q=${entry},us&appid=${process.env.W_API}`;
    let data = await buildResponseBody(geoURL);
    if (data.length === 0) {
      return console.error(`${entry} is not a valid location, please try again.`);
    }
    await PrintWeather(`lat=${data[0]["lat"]}&lon=${data[0]["lon"]}`);
    return;
  }
  await PrintWeather(`zip=${entry}`);
}

let entry = process.argv.slice(2).toString();
userDataInput(entry);
