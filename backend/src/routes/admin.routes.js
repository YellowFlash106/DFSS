const router = require("express").Router();

const authenticate = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

router.get(
  "/dashboard",
  authenticate,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin Dashboard",
      user: req.user,
    });
  }
);

module.exports = router;