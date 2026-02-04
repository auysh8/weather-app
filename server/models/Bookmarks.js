const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

bookmarkSchema.index({ city: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
