const router = require("express").Router();
const History = require("../models/History");

router.get("/", async (req, res) => {
  try {
    const history = await History.find().sort({ seacrhAt: -1 }).limit(3);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (res, req) => {
  const [cityName] = req.body;
  if (!cityName) return res.status(400).json({ message: "City required" });

  try {
    await History.findOneAndDelete({ city: cityName });
    const newSearch = new History({ city: cityName });
    newSearch.save();

    const count = await History.countDocuments();
    if (count > 3) {
      const oldestEntry = await History.find().sort({ searchAt: 1 });
      if (oldestEntry) await History.findByIdAndDelete(oldestEntry._id);
    }
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ error: "Error saving history" });
  }
});

module.exports = router;