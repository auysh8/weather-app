const router = require("express").Router();
const History = require("../models/History");

router.get("/", async (req, res) => {
  const searchQuery = req.query.search || "";
  console.log("Search Query:", searchQuery);
  try {
    let filter = {};
    if(searchQuery){
      filter = {city: { $regex: searchQuery, $options: "i" }};
    }
    const history = await History.find(filter).sort({ searchAt: -1 }).limit(3);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { cityName } = req.body;
  if (!cityName) return res.status(400).json({ message: "City required" });

  try {
    await History.findOneAndDelete({ city: cityName });
    const newSearch = new History({ city: cityName });
    await newSearch.save();

    const count = await History.countDocuments();
    if (count > 20) {
      const oldestEntry = await History.findOne().sort({ searchAt: 1 });
      if (oldestEntry) await History.findByIdAndDelete(oldestEntry._id);
    }
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ error: "Error saving history" });
  }
});

module.exports = router;
