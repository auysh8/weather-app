require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Database Connected"))
  .catch((err) => console.error(err));

const authRoutes = require("./routes/auth");
const bookmarkRoutes = require("./routes/bookmarks");
const weatherRoutes = require("./routes/weather");
const historyRoutes = require("./routes/history");

app.use("/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/", weatherRoutes);
app.use("/api/history", historyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
