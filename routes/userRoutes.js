const express = require("express");
const router = express.Router();
const User = require("../modules/user");
const { getWeatherData } = require("../services/weatherService");

// Route to store user details
router.post("/users", async (req, res) => {
  try {
    const { email, location } = req.body;

    // Fetch weather data for the user's location
    const weatherData = await getWeatherData(location);

    // Save the user with weather data to the database
    const newUser = new User({
      email,
      location,
      weatherData: [
        {
          temperature: weatherData.temperature,
          conditions: weatherData.conditions,
        },
      ],
    });

    const savedUser = await newUser.save();

    res.json(savedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to update user location
router.put("/users/:id/location", async (req, res) => {
  try {
    const userId = req.params.id;
    const newLocation = req.body.location;

    // Fetch weather data for the new location
    const weatherData = await getWeatherData(newLocation);

    // Update user location and weather data in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          weatherData: {
            temperature: weatherData.temperature,
            conditions: weatherData.conditions,
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to retrieve user's weather data for a given day
router.get("/users/:id/weather/:date", async (req, res) => {
  try {
    const userId = req.params.id;
    const date = req.params.date;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract weather data for the given date
    const weatherDataForDate = user.weatherData.filter(
      (entry) => entry.date.toISOString().split("T")[0] === date
    );

    res.json({ userId, date, weatherData: weatherDataForDate });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
