const nodemailer = require("nodemailer");
require("dotenv").config();

// Use your Gmail account for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

function sendWeatherReport(userEmail, weatherData) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: "Hourly Weather Report",
    text: `Temperature: ${weatherData.temperature}\nConditions: ${weatherData.conditions}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error.message);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = { sendWeatherReport };
