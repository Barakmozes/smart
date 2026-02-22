const express = require("express");
const path    = require("path");
const http    = require("http");
const cors    = require("cors");

// DB connection — import triggers mongoose.connect()
require("./db/mongoConnect");

const { routesInit } = require("./routes/configRoutes");

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────

// Enable CORS for the React dev server (localhost:3000) and any deployed client
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Serve static assets from /public (e.g. uploaded images)
app.use(express.static(path.join(__dirname, "public")));

// ── API health check ───────────────────────────────────────────────────────
// BUG FIXED: this was registered AFTER routesInit(app), but configRoutes ends
// with a wildcard catch-all that fires before this handler ever runs.
// Registering it here, before routesInit, ensures it always responds correctly.
app.get("/api/health", (req, res) => {
  res.json({ msg: "DOLCI API is live!", status: 200, timestamp: new Date() });
});

// ── All API + client routes ────────────────────────────────────────────────
// Order inside routesInit matters — see configRoutes.js for details.
routesInit(app);

// ── Start server ──────────────────────────────────────────────────────────
const server = http.createServer(app);
const PORT   = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`✅  DOLCI server running on http://localhost:${PORT}`);
});
