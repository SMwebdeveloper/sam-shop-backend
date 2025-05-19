const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route")
require("dotenv").config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoute)

const PORT = process.env.PORT || 9090;

const startProject = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB connected"));
    app.listen(PORT, () => {
      console.log(`Listening on - http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startProject();
