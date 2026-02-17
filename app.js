const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");

require("./models");
// router
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");
const fileRoute = require("./routes/file.route");
const cateogoryRoute = require("./routes/category.route");
const shopRouter = require("./routes/shop.route");

// middleware
const errorMiddleware = require("./middlewares/error.middleware");
const langMiddleware = require("./middlewares/language.middleware");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("static"));
app.use(fileupload());

// middleware
app.use(langMiddleware);
// routes
app.use("/api/auth", authRoute);
app.use("/api/product", productRoute);
app.use("/api/media-file", fileRoute);
app.use("/api/category", cateogoryRoute);
app.use("/api/shop", shopRouter);

app.use(errorMiddleware);
const PORT = process.env.PORT || 9090;

const startProject = async () => {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/sam-shop-backend")
      .then(() => console.log("MongoDB connected"));
    app.listen(PORT, () => {
      console.log(`Listening on - http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startProject();
