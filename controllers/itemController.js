const Item = require("../models/itemModel");
const fs = require("fs").promises;
const path = require("path");

const logFilePath = path.join(__dirname, "../logs/logs.json");

const logMetadata = async (data) => {
  try {
    let logs = [];
    try {
      const existingLogs = await fs.readFile(logFilePath, "utf-8");
      logs = JSON.parse(existingLogs);
    } catch (err) {
      logs = [];
    }
    logs.push(data);
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
};

exports.createItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const newItem = await Item.create(name, description);
    
    // Log metadata
    await logMetadata({ id: newItem.id, name, created_at: new Date().toISOString() });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.getAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.getById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedItem = await Item.update(req.params.id, name, description);
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.delete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
