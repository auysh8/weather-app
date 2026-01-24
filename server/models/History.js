const mongoose = require("mongoose");
const { type } = require("node:os");

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
});

module.exports = mongoose.model("History", HistorySchema);
