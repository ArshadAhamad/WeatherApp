const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.OPENWEATHERMAP_API_KEY;

async function getWeatherData(location) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
    );
    return {
      temperature: response.data.main.temp,
      conditions: response.data.weather[0].description,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error.message);
    throw error;
  }
}

module.exports = { getWeatherData };
