const db = require("../config/db");

const Item = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM items");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM items WHERE id = ?", [id]);
    return rows[0];
  },

  create: async (name, description) => {
    const [result] = await db.query("INSERT INTO items (name, description) VALUES (?, ?)", [name, description]);
    return { id: result.insertId, name, description };
  },

  update: async (id, name, description) => {
    await db.query("UPDATE items SET name = ?, description = ? WHERE id = ?", [name, description, id]);
    return { id, name, description };
  },

  delete: async (id) => {
    await db.query("DELETE FROM items WHERE id = ?", [id]);
  },
};

module.exports = Item;
