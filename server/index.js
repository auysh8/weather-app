const express = require("express");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const NodeCache = require("node-cache");
const myCache = new NodeCache({stdTTL: 600});

const app = express();
const PORT = process.env.PORT || 5000;
const History = require("./models/History");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Connection failed : ", err));

const weatherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/weather", weatherLimiter);
app.use("/forecast", weatherLimiter);
app.use("/api/AQI" ,weatherLimiter);

const bookmarkSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true,
  },
});

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
let apiCall = 0;
// --- BOOKMARKS ---

// [CREATE] Adds a new city to the user's bookmarks
// - Validates input
// - Prevents duplicates (returns 409 if already exists)
app.post("/api/bookmarks", async (req, res) => {
  try {
    const { city } = req.body;

    if (!city) {
      return res.status(400).json({ message: "City name is required." });
    }

    const existing = await Bookmark.findOne({ city });
    if (existing) {
      return res.status(409).json({ message: "City already bookmarked." });
    }

    const newBookmark = new Bookmark({ city });
    await newBookmark.save();

    res.status(201).json({ message: "Bookmark saved!", data: newBookmark });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

// [DELETE] Removes a specific city from bookmarks
// - Returns 200 on success, 404 if city wasn't found
app.delete("/api/bookmarks/:city", async (req, res) => {
  const cityToDelete = req.params.city;
  console.log("Attempting to delete:", cityToDelete);

  try {
    const results = await Bookmark.findOneAndDelete({ city: cityToDelete });

    if (results) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "City not found in bookmarks" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// [READ] Fetches the list of all bookmarked cities
app.get("/api/bookmarks", async (req, res) => {
  try {
    const allBookmarks = await Bookmark.find({});
    res.status(200).json(allBookmarks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookmarks", error: error.message });
  }
});

// --- WEATHER APIs (External Proxy) ---

// [PROXY] Fetches 5-day weather forecast from OpenWeatherMap
// - Forwards API errors (like 404) correctly to the frontend
app.get("/forecast", async (req, res) => {
  const city = req.query.city;
  if (!city)
    return res.status(400).json({ message: "City parameter required" });

  const cacheKey = `${city.toLocaleLowerCase()}_forcast`;
  const cachedData = myCache.get(cacheKey);
  if(cachedData){
    console.log(`[Cache hit ] Serving ${city} forecast from cache`);
    return res.json(cachedData);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  try {
    apiCall++;
    console.log(apiCall);
    const response = await axios.get(url);
    myCache.set(cacheKey , response.data);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Weather service unavailable" });
    }
  }
});

// [PROXY] Fetches current weather conditions from OpenWeatherMap
// - Used for the main weather card display
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city)
    return res.status(400).json({ message: "City parameter required" });

  const cacheKey = `weather_${city.toLocaleLowerCase()}`;
  const cachedData = myCache.get(cacheKey);

  if(cachedData){
    console.log(`[Cache hit] Serving ${city} from memory`)
    return res.json(cachedData);
  }

  console.log(`[API MISS] Fetching ${city} from OpenWeather`);

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  try {
    apiCall++;
    console.log(apiCall);
    const response = await axios.get(url);
    myCache.set(cacheKey , response.data);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// [PROXY] Fetches Air Quality Index (AQI) data using Latitude/Longitude
app.get("/api/AQI", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon)
    return res.status(400).json({ message: "Coordinates required" });

  const cacheKey = `aqi_${lat}_${lon}`;
  const cachedData = myCache.get(cacheKey);
  if(cachedData){
    console.log("[Cache hit] serving aqi from cache")
    return res.json(cachedData);
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );
    myCache.set(cacheKey , response.data);
    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: "AQI service unavailable" });
    }
  }
});

// --- HISTORY ---

// [READ] Fetches the 3 most recent search terms
app.get("/api/history", async (req, res) => {
  try {
    const history = await History.find().sort({ searchAt: -1 }).limit(3);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: "Error fetching history" });
  }
});

// [CREATE] Adds a city to search history
// - Removes duplicates (moves old search to top)
// - Maintains a strict limit of 3 items (deletes oldest if > 3)
app.post("/api/history", async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) return res.status(400).json({ message: "City name required" });

  try {
    await History.findOneAndDelete({ city: cityName });
    const newSearch = new History({ city: cityName });
    await newSearch.save();

    const count = await History.countDocuments();
    if (count > 3) {
      const oldestEntry = await History.findOne().sort({ searchAt: 1 });
      if (oldestEntry) {
        await History.findByIdAndDelete(oldestEntry._id);
      }
    }
    res.status(201).json(newSearch);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving history" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
