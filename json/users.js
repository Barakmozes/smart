const express = require("express");
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middlewares/auth");
const {
  UserModel,
  validateUser,
  validateLogin,
  createToken,
} = require("../models/userModel");

const router = express.Router();

/**
 * GET /users/
 * Health check for the users endpoint.
 */
router.get("/", (req, res) => {
  res.json({ msg: "Users endpoint is live." });
});

/**
 * GET /users/checkToken
 * Validates the token and returns its decoded payload (user id + role).
 * Used by the React admin guard to confirm admin access.
 */
router.get("/checkToken", auth, (req, res) => {
  res.json(req.tokenData);
});

/**
 * GET /users/userInfo
 * Returns the full profile of the currently logged-in user (password excluded).
 */
router.get("/userInfo", auth, async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { _id: req.tokenData._id },
      { password: 0 }
    );
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.json(user);
  } catch (err) {
    console.error("GET /userInfo:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * GET /users/usersList
 * Admin only — returns a paginated list of all users.
 */
router.get("/usersList", authAdmin, async (req, res) => {
  const perPage = Math.min(parseInt(req.query.perPage) || 20, 50);
  const page    = Math.max(parseInt(req.query.page) || 1, 1);
  const sort    = req.query.sort || "_id";
  const reverse = req.query.reverse === "yes" ? 1 : -1;

  try {
    const data = await UserModel.find({}, { password: 0 })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.error("GET /usersList:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * POST /users/
 * Register a new user (sign up).
 * Password is hashed with bcrypt before saving.
 */
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();

    // Never expose the hashed password to the client
    user.password = "***";
    res.status(201).json(user);
  } catch (err) {
    // code 11000 = MongoDB duplicate key (email already exists)
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }
    console.error("POST /users:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * POST /users/login
 * Authenticate a user and return a signed JWT token + role.
 *
 * BUG FIXED: route was "/logIn" (camelCase) but the frontend and admin panel
 * both POST to "/users/login" (lowercase), causing 404 on every login attempt.
 */
router.post("/login", async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ msg: "Email or password is incorrect." });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ msg: "Email or password is incorrect." });
    }

    const token = createToken(user._id, user.role);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("POST /login:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * PATCH /users/changeRole/:id/:role
 * Admin only — change any user's role.
 * Prevents admins from modifying themselves or the super-admin account.
 */
router.patch("/changeRole/:id/:role", authAdmin, async (req, res) => {
  const { id, role } = req.params;
  const SUPER_ADMIN_ID = "63b2a02cee44ada32ecbe89e"; // admin@walla.com

  if (id === req.tokenData._id || id === SUPER_ADMIN_ID) {
    return res
      .status(403)
      .json({ msg: "You cannot change your own role or the super-admin's role." });
  }

  const allowedRoles = ["user", "admin"];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ msg: `Role must be one of: ${allowedRoles.join(", ")}.` });
  }

  try {
    const data = await UserModel.updateOne({ _id: id }, { role });
    if (data.matchedCount === 0) {
      return res.status(404).json({ msg: "User not found." });
    }
    res.json({ msg: `Role updated to "${role}" successfully.`, data });
  } catch (err) {
    console.error("PATCH /changeRole:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

/**
 * DELETE /users/:id
 * Admin can delete any user.
 * Regular users can only delete their own account.
 */
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const filter =
      req.tokenData.role === "admin"
        ? { _id: id }
        : { _id: id, _id: req.tokenData._id }; // user can only delete themselves

    const data = await UserModel.deleteOne(filter);
    if (data.deletedCount === 0) {
      return res.status(404).json({ msg: "User not found or access denied." });
    }
    res.json({ msg: "User deleted successfully.", data });
  } catch (err) {
    console.error("DELETE /users/:id:", err.message);
    res.status(500).json({ msg: "Server error.", err: err.message });
  }
});

module.exports = router;
