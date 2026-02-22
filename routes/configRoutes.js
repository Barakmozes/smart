const usersR     = require("./users");
const companiesR = require("./companies");
const devicesR   = require("./devices");
const indexR     = require("./index"); // React build fallback — MUST be last

/**
 * Central route registry.
 *
 * BUG FIXED (two bugs):
 *  1. indexR (wildcard *) was mounted first at "/", which intercepted EVERY
 *     request — including /users, /companies, /devices — before the API
 *     routers ever got a chance to run. All API calls were returning the
 *     React HTML page instead of JSON.
 *
 *  2. app_routes.js had `app.use("/",)` — a bare comma with no router
 *     argument, which is a JavaScript syntax error that crashes on startup.
 *     That dead file is now replaced by this single, correct configRoutes.js.
 *
 * Correct order: specific API prefixes first → React fallback last.
 */
exports.routesInit = (app) => {
  app.use("/users",     usersR);
  app.use("/companies", companiesR);
  app.use("/devices",   devicesR);

  // React client-side routing fallback.
  // Must come after all API routes so it only fires when nothing else matched.
  app.use("/", indexR);
};
