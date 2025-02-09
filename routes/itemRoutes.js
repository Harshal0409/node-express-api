const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new item
router.post("/", createItem);

// Get all items
router.get("/", getItems);

// Get a single item by ID
router.get("/:id", getItemById);

// Update an item by ID
router.put("/:id", updateItem);

// Delete an item by ID
router.delete("/:id", deleteItem);

module.exports = router;
