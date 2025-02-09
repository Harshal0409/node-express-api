const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs").promises;
const path = require("path");
const { body, param, validationResult } = require("express-validator");

// Helper function to read/write logs
const logFilePath = path.join(__dirname, "../logs.json");

const readLogs = async () => {
  try {
    const data = await fs.readFile(logFilePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code !== "ENOENT") {
      throw new Error("Error reading log file");
    }
    return []; // Return empty array if file doesn't exist
  }
};

const writeLogs = async (logs) => {
  await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
};

// ✅ 1️⃣ Create a new item
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description").optional().trim(),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      // Insert into database
      const [result] = await db.execute(
        "INSERT INTO items (name, description) VALUES (?, ?)",
        [name, description]
      );

      const newItem = {
        id: result.insertId,
        name,
        description,
        created_at: new Date().toISOString(),
      };

      // Log the new item
      const logs = await readLogs();
      logs.push(newItem);
      await writeLogs(logs);

      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ 2️⃣ Retrieve all items
router.get("/", async (req, res) => {
  try {
    const [items] = await db.execute("SELECT * FROM items");
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ 3️⃣ Retrieve a single item by ID
router.get(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer")],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const [items] = await db.execute("SELECT * FROM items WHERE id = ?", [
        req.params.id,
      ]);
      if (items.length === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(items[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ 4️⃣ Update an item by ID
router.put(
  "/:id",
  [
    param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer"),
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("description").optional().trim(),
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;
      const [result] = await db.execute(
        "UPDATE items SET name = ?, description = ? WHERE id = ?",
        [name, description, req.params.id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ✅ 5️⃣ Delete an item by ID
router.delete(
  "/:id",
  [param("id").isInt({ min: 1 }).withMessage("ID must be a positive integer")],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const [result] = await db.execute("DELETE FROM items WHERE id = ?", [
        req.params.id,
      ]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
