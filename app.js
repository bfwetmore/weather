const weather = require("./weather");

const input = process.argv.slice(2).toString();
weather.getWeather(input);
