const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

require("dotenv").config();

dns.setServers(["8.8.8.8"]);

const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/authRoutes");
const epkRoutes = require("./routes/epkRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/epk", epkRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:");
    console.log(error.message);
  });

app.get("/", (req, res) => {
  res.send("Digital EPK Book Backend is running!");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});