const router = require("express").Router();
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
require("dotenv").config();

const myCache = new NodeCache({ stdTTL: 600 });

const weatherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: "Too many request" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(weatherLimiter);

//CURRENT WEATHER

router.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json("City is required");

  const cacheKey = `weather_${city.toLowerCase()}`;
  const cachedData = myCache.get(cacheKey);
  if (cachedData) return res.json(cachedData);

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    myCache.set(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//FORECAST

router.get("/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ message: "City Required" });

  const cacheKey = `forecast_${city.toLowerCase()}`;
  const cachedData = myCache.get(cacheKey);
  if (cachedData) return res.json(cachedData);
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    await myCache.set(cacheKey, response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status.json({ message: "Server error" });
  }
});

//AQI

router.get("/api/AQI", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ message: "Location coords required" });
  const cacheKey = `aqi_${lat}_${lon}`;
  const cachedData = myCache.get(cacheKey);
  if (cachedData) return res.json(cachedData);
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await axios.get(url);
    myCache.set(cacheKey, response.data);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
