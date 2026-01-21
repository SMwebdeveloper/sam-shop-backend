const Category = require("../models/category.model");
const mongoose = require("mongoose");
const defaultCategories = require("../data/defaultCategory");

async function seed() {
  try {
    await mongoose
      .connect("mongodb://localhost:27017/sam-shop-backend")
      .then(() => console.log("MongoDB connected"));
    const existingCategories = await Category.countDocuments();

    if (existingCategories === 0) {
      await Category.insertMany(defaultCategories);
      console.log("Default categories seeded successfully");
    } else {
      console.log("Categories already exist, skipping seeding...");
    }

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

seed();
