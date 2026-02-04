const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");
const { timeStamp } = require("node:console");

const userScheme = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User" , userScheme);