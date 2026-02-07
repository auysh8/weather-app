const router = require("express").Router();
const History = require("../models/History");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, async (req, res) => {
  const searchQuery = req.query.search || "";
  const userId = req.user.id;
  try {
    let filter = { user: userId };
    if (searchQuery) {
      filter = { ...filter, city: { $regex: searchQuery, $options: "i" } };
    }
    const history = await History.find(filter).sort({ searchAt: -1 }).limit(3);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { cityName } = req.body;
  const userId = req.user.id;
  if (!cityName) return res.status(400).json({ message: "City required" });

  try {
    await History.findOneAndDelete({ city: cityName , user: userId});
    const newSearch = new History({ city: cityName , user: userId});
    await newSearch.save();

    const count = await History.countDocuments({user : userId});
    if (count > 20) {
      const oldestEntry = await History.findOne({user : userId}).sort({ searchAt: 1 });
      if (oldestEntry) await History.findByIdAndDelete(oldestEntry._id);
    }
    res.status(201).json(newSearch);
  } catch (error) {
    res.status(500).json({ error: "Error saving history" });
  }
});

module.exports = router;
