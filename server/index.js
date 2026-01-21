const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const { sync } = require("framer-motion");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Connection failed : ", err));

const bookmarkSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true,
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

app.post("/api/bookmarks", async (req, res) => {
  try {
    const { city } = req.body;
    const newBookmark = new Bookmark({ city });
    await newBookmark.save();
    res.status(201).json({ message: "Bookmark saved!", data: newBookmark });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error saving bookmark", error: error.message });
  }
});

app.get("/api/bookmarks", async (req, res) => {
  try {
    const allBookmarks = await Bookmark.find({});
    res.status(200).json(allBookmarks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookmark", error: error.message });
  }
});

app.get("/forecast", async (req, res) => {
  const city = req.query.city;
  console.log(city);
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
  }
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  console.log(city);
  const apiKey = process.env.OPENWEATHER_API_KEY;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
