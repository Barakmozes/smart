const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { CompanyModel, validateCompany } = require("../models/companyModel");

const router = express.Router();

/**
 * GET /companies
 * Public — returns all categories (used by the product filter dropdown).
 */
router.get("/", async (req, res) => {
  try {
    const data = await CompanyModel.find({}).sort({ company_id: 1 });
    res.json(data);
  } catch (err) {
    console.error("GET /companies:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * GET /companies/count
 * Public — returns total count and pages (used by admin pagination).
 */
router.get("/count", async (req, res) => {
  const perPage = Math.min(parseInt(req.query.perPage) || 10, 100);
  try {
    const count = await CompanyModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (err) {
    console.error("GET /companies/count:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * GET /companies/single/:id
 * Public — returns a single category by its MongoDB _id.
 */
router.get("/single/:id", async (req, res) => {
  try {
    const data = await CompanyModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ msg: "Category not found." });
    }
    res.json(data);
  } catch (err) {
    console.error("GET /companies/single/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * POST /companies
 * Admin only — add a new category.
 */
router.post("/", authAdmin, async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const category = new CompanyModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "A category with this company_id already exists." });
    }
    console.error("POST /companies:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * PUT /companies/:id
 * Admin only — update a category by its MongoDB _id.
 */
router.put("/:id", authAdmin, async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const data = await CompanyModel.updateOne({ _id: req.params.id }, req.body);
    if (data.matchedCount === 0) {
      return res.status(404).json({ msg: "Category not found." });
    }
    res.json({ msg: "Category updated successfully.", data });
  } catch (err) {
    console.error("PUT /companies/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * DELETE /companies/:id
 * Admin only — delete a category by its MongoDB _id.
 */
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const data = await CompanyModel.deleteOne({ _id: req.params.id });
    if (data.deletedCount === 0) {
      return res.status(404).json({ msg: "Category not found." });
    }
    res.json({ msg: "Category deleted successfully.", data });
  } catch (err) {
    console.error("DELETE /companies/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

module.exports = router;
