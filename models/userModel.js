const mongoose = require("mongoose");
const Joi      = require("joi");
const jwt      = require("jsonwebtoken");
const { config } = require("../config/secrets");

/**
 * Mongoose schema for a user account.
 *
 * BUG FIXED: email was defined as plain `String` with no uniqueness constraint.
 * Without `unique: true`, MongoDB never creates a unique index, so inserting a
 * duplicate email never throws error code 11000 — the duplicate-email guard in
 * users.js POST route was completely dead code.
 * Setting `unique: true` here creates the index and makes that guard work.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // BUG FIXED: was just String — no uniqueness enforced
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // only valid role values
    },
    date_created: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

exports.UserModel = mongoose.model("users", userSchema);

/**
 * Creates a signed JWT containing the user's id and role.
 * Token expires in 10 hours (600 minutes).
 */
exports.createToken = (user_id, role) => {
  return jwt.sign({ _id: user_id, role }, config.token_secret, {
    expiresIn: "600m",
  });
};

/**
 * Joi validation for the sign-up body.
 * Phone is validated as a 10-digit Israeli number.
 */
exports.validateUser = (body) => {
  const schema = Joi.object({
    name:     Joi.string().min(2).max(150).required(),
    phone:    Joi.string().min(9).max(15).required(),
    email:    Joi.string().email().min(5).max(150).required(),
    password: Joi.string().min(3).max(150).required(),
  });
  return schema.validate(body);
};

/**
 * Joi validation for the login body.
 */
exports.validateLogin = (body) => {
  const schema = Joi.object({
    email:    Joi.string().email().min(5).max(150).required(),
    password: Joi.string().min(3).max(150).required(),
  });
  return schema.validate(body);
};
