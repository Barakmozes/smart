const jwt = require("jsonwebtoken");
const { config } = require("../config/secrets");

/**
 * Middleware: verify any logged-in user's token.
 * Token must be sent in the "x-api-key" request header.
 */
exports.auth = (req, res, next) => {
  const token = req.header("x-api-key");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Access denied. No token provided in x-api-key header." });
  }

  try {
    const decoded = jwt.verify(token, config.token_secret);
    req.tokenData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is invalid or has expired." });
  }
};

/**
 * Middleware: verify token AND confirm the user has the admin role.
 *
 * BUG FIXED: was using hardcoded "monkeysSecret" instead of config.token_secret,
 * meaning every admin action silently failed token verification.
 */
exports.authAdmin = (req, res, next) => {
  const token = req.header("x-api-key");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Access denied. No token provided in x-api-key header." });
  }

  try {
    // FIX: use the same secret that signs the token — config.token_secret
    const decoded = jwt.verify(token, config.token_secret);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Forbidden. Admin access required." });
    }

    req.tokenData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is invalid or has expired." });
  }
};
