const db = require("../config/db");

const User = {
  // Find a user by username
  findByUsername: async (username) => {
    if (!username) {
      throw new Error("Username is required");
    }

    try {
      const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
      if (rows.length === 0) {
        return null; // Return null if no user is found
      }
      return rows[0];
    } catch (error) {
      console.error("Error finding user by username:", error);
      throw new Error("Failed to find user by username");
    }
  },

  // Create a new user
  create: async (username, hashedPassword) => {
    if (!username || !hashedPassword) {
      throw new Error("Username and hashed password are required");
    }

    try {
      // Check if the username already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        throw new Error("Username already exists");
      }

      // Insert the new user
      const [result] = await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
      return { id: result.insertId, username };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  },
};

module.exports = User;
