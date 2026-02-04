const router = require("express").Router();
const Bookmark = require("../models/Bookmarks");
const verifyToken = require("../middleware/auth");

//CREATE A BOOKMARK

router.post("/", verifyToken, async (req, res) => {
  try {
    const { city } = req.body;
    const userId = req.user.id;

    if (!city) return res.status(400).json({ message: "City name required" });
    const existing = await Bookmark.findOne({ city, user: userId });
    if (existing)
      return res.status(409).json({ message: "City already bookmarked" });

    const newBookmark = new Bookmark({ city, user: userId });
    await newBookmark.save();

    res.status(201).json({ message: "Bookmark saved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//READ A BOOKAMARK

router.get("/", verifyToken, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//DELETE A BOOKMARK

router.delete("/:city", verifyToken, async (req, res) => {
    try{
        const result = await Bookmark.findOneAndDelete({
            city : req.params.city,
            user: req.user.id
        })
        if(result)  return res.status(200).json({message : "Bookmark deleted"});
        else res.status(404).json({message : "Bookmark not found"})
    }
    catch(error){
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;
