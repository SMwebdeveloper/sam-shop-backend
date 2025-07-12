const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route")
const fileRoute = require("./routes/file.route")
const cookieParser = require("cookie-parser")
const fileupload = require("express-fileupload")
const errorMiddleware = require("./middlewares/error.middleware");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.static("static"))
app.use(fileupload())
// routes
app.use('/api/auth', authRoute)
app.use("/api/product", productRoute)
app.use("/api/media-file", fileRoute)

app.use(errorMiddleware)

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
