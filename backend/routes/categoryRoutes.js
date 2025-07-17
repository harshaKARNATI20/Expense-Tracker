const express = require("express");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET all categories
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST new category
router.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name required" });

  try {
    // Avoid duplicates
    let existing = await Category.findOne({ name });
    if (existing) return res.status(200).json(existing);

    const newCat = new Category({ name });
    await newCat.save();
    res.status(201).json(newCat);
  } catch (err) {
    res.status(500).json({ error: "Failed to add category" });
  }
});

module.exports = router;
