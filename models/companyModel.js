const mongoose = require("mongoose");
const Joi = require("joi");

/**
 * Mongoose schema for a product category (called "company" in the original codebase).
 * Matches the shape of data in companies.json.
 */
const companySchema = new mongoose.Schema({
  name:                { type: String, required: true, trim: true },
  company_id:          { type: Number, required: true, unique: true },
  CategoryDescription: { type: String, default: "" },
});

exports.CompanyModel = mongoose.model("companies", companySchema);

/**
 * Joi validation for creating / updating a category.
 *
 * BUG FIXED: CategoryDescription had Joi.string().min(1).required() which
 * rejects empty strings. Every real document in companies.json has
 * CategoryDescription: "" — so every POST and PUT through the admin panel
 * returned a 400 validation error. Now allows empty strings and is optional.
 */
exports.validateCompany = (body) => {
  const schema = Joi.object({
    name:                Joi.string().min(1).max(150).required(),
    company_id:          Joi.number().min(1).max(9999).required(),
    CategoryDescription: Joi.string().max(300).allow("", null).optional(),
  });
  return schema.validate(body);
};
