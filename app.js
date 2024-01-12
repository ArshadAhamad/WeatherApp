const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const User = require("./modules/user");
const { getWeatherData } = require("./services/weatherService");
const { sendWeatherReport } = require("./services/emailService");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());

// Use routes
app.use("/api", userRoutes);

// Schedule hourly weather reports
cron.schedule("0 */3 * * *", async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      const latestWeatherEntry = user.weatherData[user.weatherData.length - 1];
      const currentTime = new Date();

      // Fetch new weather data if the last entry is more than an hour old
      if (currentTime - latestWeatherEntry.date >= 60 * 60 * 1000) {
        const newWeatherData = await getWeatherData(user.location);
        user.weatherData.push({
          date: currentTime,
          temperature: newWeatherData.temperature,
          conditions: newWeatherData.conditions,
        });
        await user.save();

        // Send hourly weather report
        sendWeatherReport(user.email, newWeatherData);
      }
    }
  } catch (error) {
    console.error(
      "Error fetching or sending hourly weather reports:",
      error.message
    );
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
