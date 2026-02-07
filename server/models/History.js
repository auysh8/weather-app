const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true,
  },
  searchAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("History", HistorySchema);
