const express = require("express");
const path    = require("path"); // BUG FIXED: was used but never required

const router = express.Router();

/**
 * Wildcard fallback — serves the React production build for any route
 * that is not matched by the API routers above it in configRoutes.js.
 *
 * This MUST be registered LAST in configRoutes.js so it never swallows
 * any /users, /devices, or /companies API requests.
 *
 * BUG FIXED: path.join(__dirname, ...) was using __dirname which points
 * to the /routes folder; added "../" to correctly reach /client/build.
 */
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

module.exports = router;
