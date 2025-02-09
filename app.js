const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const limiter = require("./middlewares/rateLimiter");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json()); // Correct position
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(limiter); // Apply rate limiting to all routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes); // Removed duplicate

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
