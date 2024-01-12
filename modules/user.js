const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  weatherData: {
    type: [
      {
        date: { type: Date, default: Date.now },
        temperature: Number,
        conditions: String,
      },
    ],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
