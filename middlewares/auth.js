const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.header("Authorization");
    console.log("Received Token:", token); // Log the token to verify it's in the correct format
    // Check if the token exists and starts with 'Bearer'
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided or invalid token format." });
    }

    // Remove the 'Bearer ' prefix
    const tokenWithoutBearer = token.replace("Bearer ", "");

    try {
        // Verify the token
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Log the error for debugging (optional)
        console.error("Token verification error:", error);

        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token." });
        } else {
            return res.status(401).json({ message: "Authentication failed." });
        }
    }
};
