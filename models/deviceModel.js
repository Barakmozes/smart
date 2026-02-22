const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Mongoose schema for a product (called "device" in the original codebase).
 * Matches the shape of data in devices.json.
 */
const deviceSchema = new mongoose.Schema(
  {
    Name:               { type: String, required: true },
    Description:        { type: String, required: true },
    Link:               { type: String },
    company_id:         { type: String, required: true }, // FK → companies.company_id (stored as string)
    ImageURL:           { type: String, default: "" },
    Weight:             { type: String },
    Size:               { type: String },
    Price:              { type: Number, required: true },
    Discount:           { type: Number, default: 0 },
    AvailabilityStatus: { type: String, default: "available" },
    user_id:            { type: String },  // set by the server from the JWT token
    date_created:       { type: Date, default: Date.now },
  },
  { timestamps: false }
);

exports.DeviceModel = mongoose.model("devices", deviceSchema);

/**
 * Joi validation for creating / updating a product.
 *
 * BUG FIXED (two issues):
 *  1. company_id was validated as Joi.number() but the Mongoose schema
 *     stores it as String, and every real document in the DB has it as "1",
 *     "2", etc. The Joi type is now string() to match reality.
 *
 *  2. Several fields (Link, Weight, Size, Discount, AvailabilityStatus)
 *     were required() in Joi but many real DB documents don't have them.
 *     These are now optional so the admin panel's add/edit forms don't
 *     reject valid payloads.
 *
 *  3. Price.max was 999 (₪), raised to 99999 so real pastry prices fit.
 */
exports.validateDevice = (body) => {
  const schema = Joi.object({
    Name: Joi.string().min(2).max(200).required(),
    Description: Joi.string().min(2).max(500).required(),
    Link: Joi.string().max(500).allow("", null).optional(),

    // BUG FIXED: was Joi.number() — must be Joi.string() to match schema + real data
    company_id: Joi.string().required(),

    ImageURL:           Joi.string().max(1000).allow("", null).optional(),
    Weight:             Joi.string().max(100).allow("", null).optional(),
    Size:               Joi.string().max(100).allow("", null).optional(),
    Price:              Joi.number().min(0).max(99999).required(),
    Discount:           Joi.number().min(0).max(100).default(0).optional(),
    AvailabilityStatus: Joi.string().max(100).allow("", null).optional(),
  });

  return schema.validate(body);
};
