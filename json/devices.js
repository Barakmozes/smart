const express = require("express");
const { DeviceModel, validateDevice } = require("../models/deviceModel");
const { auth, authAdmin } = require("../middlewares/auth");

const router = express.Router();

/**
 * GET /devices
 * Public — returns a paginated, sortable list of products.
 *
 * Query params:
 *   page    {number}  — page number, default 1
 *   perPage {number}  — items per page, default 9, max 100
 *   sort    {string}  — field to sort by, default "_id"
 *   reverse {string}  — "yes" for ascending, anything else descending
 *
 * BUG FIXED: req.query values are always strings. The original code did:
 *   Math.min(req.query.perPage, 20)
 * When req.query.perPage is undefined, Math.min(undefined, 20) = NaN,
 * which caused .limit(NaN) to return ALL documents — ignoring pagination.
 * All query numbers now go through parseInt() before arithmetic.
 */
router.get("/", async (req, res) => {
  const perPage = Math.min(parseInt(req.query.perPage) || 9, 100);
  const page    = Math.max(parseInt(req.query.page)    || 1, 1);
  const sort    = req.query.sort    || "_id";
  const reverse = req.query.reverse === "yes" ? 1 : -1;

  try {
    const data = await DeviceModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.error("GET /devices:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * GET /devices/count
 * Public — returns total document count and number of pages.
 * Used by the React pagination component.
 *
 * BUG FIXED: same parseInt issue as above. Also moved to consistent 9 per page default.
 */
router.get("/count", async (req, res) => {
  const perPage = Math.min(parseInt(req.query.perPage) || 9, 100);

  try {
    const count = await DeviceModel.countDocuments({});
    res.json({ count, pages: Math.ceil(count / perPage) });
  } catch (err) {
    console.error("GET /devices/count:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * GET /devices/single/:id
 * Public — returns a single product by its MongoDB _id.
 */
router.get("/single/:id", async (req, res) => {
  try {
    const data = await DeviceModel.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ msg: "Product not found." });
    }
    res.json(data);
  } catch (err) {
    console.error("GET /devices/single/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * POST /devices
 * Auth required — any logged-in user can add a product.
 * The user_id is taken from the verified token, not the request body.
 */
router.post("/", auth, async (req, res) => {
  const { error } = validateDevice(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const device = new DeviceModel(req.body);
    device.user_id = req.tokenData._id;
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    console.error("POST /devices:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * PUT /devices/:id
 * Auth required — admin can edit any product, users can only edit their own.
 */
router.put("/:id", auth, async (req, res) => {
  const { error } = validateDevice(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  const filter =
    req.tokenData.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.tokenData._id };

  try {
    const data = await DeviceModel.updateOne(filter, req.body);
    if (data.matchedCount === 0) {
      return res.status(404).json({ msg: "Product not found or access denied." });
    }
    res.json({ msg: "Product updated successfully.", data });
  } catch (err) {
    console.error("PUT /devices/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * DELETE /devices/:id
 * Auth required — admin can delete any product, users can only delete their own.
 */
router.delete("/:id", auth, async (req, res) => {
  const filter =
    req.tokenData.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user_id: req.tokenData._id };

  try {
    const data = await DeviceModel.deleteOne(filter);
    if (data.deletedCount === 0) {
      return res.status(404).json({ msg: "Product not found or access denied." });
    }
    res.json({ msg: "Product deleted successfully.", data });
  } catch (err) {
    console.error("DELETE /devices/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

module.exports = router;
