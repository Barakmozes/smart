require("dotenv").config();

/**
 * All sensitive configuration loaded from environment variables.
 * Never hardcode these values — use a .env file locally
 * and environment variables in production.
 *
 * Required .env keys:
 *   DB_USER       — MongoDB Atlas username
 *   DB_PASS       — MongoDB Atlas password
 *   TOKEN_SECRET  — Secret string used to sign/verify JWTs (make it long and random)
 */
exports.config = {
  db_user:      process.env.DB_USER,
  db_pass:      process.env.DB_PASS,
  token_secret: process.env.TOKEN_SECRET,
};
